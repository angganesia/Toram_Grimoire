import Grimoire from '@/shared/Grimoire';

import { Stat } from '@/lib/Character/Stat';
import { StatTypes, StatNormalTypes } from '@/lib/Character/Stat/enums';

import { EnchantCategory, EnchantItem } from './base';
import STATE from './state';
import { calcPotentialExtraRate } from './utils';
import { EnchantEquipmentTypes, EnchantStepTypes } from './enums';
import type { MaterialPointTypeRange } from './base';

const EnchantEquipmentTypesList = [
  EnchantEquipmentTypes.MainWeapon,
  EnchantEquipmentTypes.BodyArmor,
] as const;

const EnchantStepTypesList = [
  EnchantStepTypes.Normal,
  EnchantStepTypes.Each,
] as const;

const EnchantStepStatTypesList = [
  StatTypes.Constant,
  StatTypes.Multiplier,
] as const;

type EnchantBuildSaveData = {
  name: string;
  equipment: EnchantEquipmentSaveData;
};

type EnchantEquipmentSaveData = {
  basePotential: number;
  originalPotential: number;
  fieldType: number;
  isOriginalElement: boolean;
  steps: EnchantStepSaveData[];
};

type EnchantStepSaveData = {
  type: number;
  hidden: boolean;
  step: number;
  stats: EnchantStepStatSaveData[];
};

type EnchantStepStatSaveData = {
  type: number;
  value: number;

  // basename of EnchantItem.statBase
  base: string;
};

interface MaterialPointCost {
  type: MaterialPointTypeRange;
  value: number;
}

class EnchantBuild {
  name: string;
  equipment: EnchantEquipment;
  categorys: EnchantCategory[];

  constructor(name: string, equipment: EnchantEquipment | null = null) {
    this.name = name;
    if (equipment) {
      this.equipment = equipment;
    }
    else {
      this.equipment = new EnchantEquipment();
      this.equipment.originalPotential = 90;
    }
    this.categorys = Grimoire.Enchant.categorys; // link
  }

  save(): EnchantBuildSaveData {
    return {
      name: this.name,
      equipment: this.equipment.save(),
    };
  }

  static load(data: EnchantBuildSaveData) {
    const categorys = Grimoire.Enchant.categorys;
    const equipment = EnchantEquipment.load(categorys, data.equipment);
    return new EnchantBuild(data.name, equipment);
  }

  copy() {
    const data = this.save();
    return EnchantBuild.load(data);
  }
}

class EnchantEquipment {
  private _steps: EnchantStep[];

  basePotential: number;
  originalPotential: number;
  fieldType: EnchantEquipmentTypes;
  isOriginalElement: boolean;

  constructor() {
    this._steps = [];
    this.basePotential = STATE.EquipmentBasePotentialMinimum,
    this.originalPotential = 1;
    this.fieldType = EnchantEquipmentTypes.MainWeapon;
    this.isOriginalElement = false;
  }

  save(): EnchantEquipmentSaveData {
    const fieldType = EnchantEquipmentTypesList.indexOf(this.fieldType);
    const steps = this._steps.map(step => step.save());
    return {
      basePotential: this.basePotential,
      originalPotential: this.originalPotential,
      fieldType,
      isOriginalElement: this.isOriginalElement,
      steps,
    };
  }

  static load(categorys: EnchantCategory[], data: EnchantEquipmentSaveData): EnchantEquipment {
    const equipment = new EnchantEquipment();
    equipment.basePotential = data.basePotential;
    equipment.originalPotential = data.originalPotential;
    equipment.fieldType = EnchantEquipmentTypesList[data.fieldType];
    equipment.isOriginalElement = typeof data.isOriginalElement === 'number' ?
      (data.isOriginalElement ? true : false) :
      data.isOriginalElement;
    const steps = data.steps.map(stepData => EnchantStep.load(categorys, equipment, stepData));
    equipment.loadSteps(steps);
    return equipment;
  }

  copy(categorys: EnchantCategory[]) {
    const data = this.save();
    return EnchantEquipment.load(categorys, data);
  }

  loadSteps(steps: EnchantStep[]) {
    this._steps = steps;
  }

  get allSteps(): EnchantStep[] {
    return this._steps;
  }

  get validSteps(): EnchantStep[] {
    if (!this.lastStep) {
      return [];
    }
    return this.steps(this.lastStep.index).filter(step => step.stats.length !== 0);
  }

  get firstStep(): EnchantStep | null {
    return this.steps()[0] || null;
  }

  get lastStep(): EnchantStep | null {
    return this.steps().find((step, i, ary) => {
      if ((i === ary.length - 1)) {
        return true;
      }
      return step.remainingPotential < 1
        || !step.belongEquipment.checkStats(step.index);
    }) || null;
  }

  get allMaterialPointCost(): number[] {
    const mats = Array(6).fill(0);
    this.steps().forEach(step =>
      step.stats.forEach(stat => {
        const t = stat.materialPointCost;
        mats[t.type] += t.value;
      }),
    );
    return mats;
  }

  /**
   * @returns {number} - Percentage of success rate, if value > 160, it will return -1
   */
  get successRate(): number {
    if (!this.lastStep) {
      return -1;
    }
    const rate = this.realSuccessRate;
    return rate >= 160 ? -1 : rate;
  }

  /**
   * @returns Percentage of success rate
   */
  get realSuccessRate(): number {
    if (!this.lastStep) {
      return 160;
    }
    const last_index = this.lastStep.index;
    const pot = this.stepRemainingPotential(last_index);
    const d = Math.max(this.stepRemainingPotential(last_index - 1), this.basePotential);
    return Math.max(160 + pot * 230 / d, 0);
  }

  get operationStepsNum() {
    if (!this.lastStep) {
      return 0;
    }
    return this.steps(this.lastStep.index).reduce((cur, step) => {
      if (!step.firstStat) {
        return cur;
      }
      if (step.type === EnchantStepTypes.Each) {
        return cur + Math.ceil(step.firstStat.value / step.step);
      }
      return cur + 1;
    }, 0);
  }

  /**
   * append new empty step
   */
  appendStep(): EnchantStep {
    const step = new EnchantStep(this);
    this._steps.push(step);
    return step;
  }

  /**
   * Get all not-hidden steps before given index (include)
   */
  steps(stepIdx?: number): EnchantStep[] {
    stepIdx = stepIdx === undefined ? this._steps.length - 1 : stepIdx;
    return stepIdx < 0 ? [] :
      this._steps.slice(0, stepIdx + 1).filter(step => !step.hidden);
  }

  /**
   * @returns Remaining potential of specified step index
   */
  stepRemainingPotential(stepIdx?: number): number {
    return this.steps(stepIdx)
      .reduce((c, step) => (c - step.potentialCost), this.originalPotential);
  }

  /**
   * @returns  Extra rate of specified step index
   */
  stepPotentialExtraRate(stepIdx?: number): number {
    const categorys: { category: EnchantCategory; cnt: number }[] = [];
    this.stats(stepIdx).forEach(stat => {
      const cat = stat.itemBase.belongCategory;
      const check = categorys.find(a => a.category === cat);
      check ? (check.cnt += 1) : categorys.push({ category: cat, cnt: 1 });
    });
    return calcPotentialExtraRate(categorys.map(category => category.cnt));
  }

  /**
   * Insert EnchantStep before given step
   * @param {EnchantStep} target
   * @returns {EnchantStep} - new EnchantStep be inserted
   */
  insertStepBefore(target: EnchantStep): EnchantStep {
    const step = new EnchantStep(this);
    this._steps.splice(target.index, 0, step);
    return step;
  }

  /**
   * Calc sum of value of specified stat of all steps before step index,
   * then return EnchantStat which value is sum.
   */
  stat(itemBase: EnchantItem, type: StatNormalTypes, stepIdx?: number): EnchantStat {
    const v = this.steps(stepIdx).reduce((c, step) => {
      const t = step.stat(itemBase, type);
      return t && t.valid ? c + t.value : c;
    }, 0);
    return new EnchantStat(itemBase, type, v);
  }

  /**
   * Get all stats of steps
   */
  stats(stepIdx?: number): EnchantStat[] {
    const stats: EnchantStat[] = [];
    this.steps(stepIdx).forEach(step => {
      step.stats.filter(stat => stat.valid).forEach(stat => {
        const t = stats.find(b => b.equals(stat));
        t ?  t.add(stat.value) : stats.push(stat.pure());
      });
    });
    return stats;
  }

  checkStats(stepIdx?: number): boolean {
    return this.checkStatsMaximumNumber(stepIdx);
  }

  checkStatsMaximumNumber(stepIdx?: number): boolean {
    return this.stats(stepIdx).length < STATE.EquipmentItemMaximumNumber;
  }

  /**
   * Check remaining potential of step > 0
   */
  checkStepRemainingPotential(stepIdx?: number): boolean {
    return this.stepRemainingPotential(stepIdx) > 0;
  }


  refreshStats() {
    this.stats().forEach(stat => {
      const [min, max] = stat.limit;
      const v = stat.value;
      if (v > max || v < min) {
        const dif = v > max ? v - max : v - min;
        this.steps().slice().reverse().find(step => {
          const t = step.stat(stat.itemBase, stat.type);
          if (t) {
            t.add(-1 * dif);
            return true;
          }
          return false;
        });
      }
    });
  }

  swapStep(i1: number, i2: number) {
    if (i1 < 0 || i2 < 0 || i1 >= this._steps.length || i2 >= this._steps.length) {
      return false;
    }
    const t = this._steps[i1];
    this._steps[i1] = this._steps[i2];
    this._steps[i2] = t;
    return true;
  }

  hasStat(stat: EnchantStat | EnchantStepStat, stepIdx?: number) {
    return this.stats(stepIdx).find(q => q.equals(stat)) ? true : false;
  }
}


class EnchantStep {
  private _parent: EnchantEquipment;
  stats: EnchantStepStat[];
  type: EnchantStepTypes;
  step: number;
  hidden: boolean;

  constructor(parent: EnchantEquipment) {
    this._parent = parent;
    this.stats = [];
    this.type = EnchantStepTypes.Normal;
    this.step = 1; // step for type == "each"
    this.hidden = false;
  }


  save(): EnchantStepSaveData {
    return {
      type: EnchantStepTypesList.indexOf(this.type),
      hidden: this.hidden,
      step: this.step,
      stats: this.stats.map(stat => stat.save()),
    };
  }

  static load(categorys: EnchantCategory[], equipment: EnchantEquipment, data: EnchantStepSaveData): EnchantStep {
    const step = new EnchantStep(equipment);
    step.type = EnchantStepTypesList[data.type] ?? EnchantStepTypes.Normal;
    step.hidden = typeof data.hidden === 'number' ? (data.hidden === 1 ? true : false) : data.hidden;
    const stats = data.stats.map(statData => EnchantStepStat.load(categorys, step, statData)).filter(stat => stat);
    step.stats = stats as EnchantStepStat[];

    return step;
  }

  get belongEquipment(): EnchantEquipment {
    return this._parent;
  }

  get potentialExtraRate() {
    return this.belongEquipment.stepPotentialExtraRate(this.index);
  }

  get index() {
    return this._parent.allSteps.indexOf(this);
  }

  get potentialCost() {
    if (this.stats.length === 0) {
      return 0;
    }
    const er = this.potentialExtraRate;
    switch (this.type) {
      case EnchantStepTypes.Normal:
        return this.realPotentialCost(this.stats.reduce((a, b) => a + b.potentialCost, 0) * er);
      case EnchantStepTypes.Each:
        return this.firstStat ? this.firstStat.potentialCost : 0;
    }
    return 0;
  }
  get remainingPotential() {
    return this.belongEquipment.stepRemainingPotential(this.index);
  }

  get previousStep(): EnchantStep | null {
    const idx = this.index;
    if (idx === 0)
      return null;
    const steps = this.belongEquipment.steps();
    return steps[idx - 1];
  }

  get nextStep(): EnchantStep | null {
    const steps = this.belongEquipment.steps();
    return steps[this.index + 1] || null;
  }

  get isLastStep() {
    return this.belongEquipment.lastStep === this;
  }

  get afterLastStep() {
    return (this.belongEquipment.lastStep as EnchantStep).index < this.index;
  }

  get firstStat(): EnchantStepStat | null {
    return this.stats[0] || null;
  }

  appendStat(itemBase: EnchantItem, type: StatNormalTypes, v: number): EnchantStepStat | null {
    const stat = new EnchantStepStat(this, itemBase, type, v);
    if (!this.belongEquipment.checkStats() && !this.belongEquipment.hasStat(stat)) {
      return null;
    }
    this.stats.push(stat);
    return stat;
  }

  stat(itemBase: EnchantItem, type: StatTypes): EnchantStepStat | null {
    return this.stats.find(stat => stat.itemBase === itemBase && stat.type === type) || null;
  }

  remove() {
    this.belongEquipment.allSteps.splice(this.index, 1);
    this.stats.forEach(p => p.remove());
  }


  realPotentialCost(p: number): number {
    return p >= 0 ? Math.floor(p) : Math.ceil(p);
  }

  hasStat(itemBase: EnchantItem, type: StatTypes): boolean {
    return this.stat(itemBase, type) ? true : false;
  }

  autoFill() {
    if (this.index === 0 || !this.belongEquipment.lastStep) {
      return;
    }
    const stats = this.belongEquipment.stats(this.belongEquipment.lastStep.index);
    const newStats: EnchantStepStat[] = [];
    stats.filter(stat => stat.value > 0).forEach(stat => {
      const max = stat.limit[1];
      const find = this.stat(stat.itemBase, stat.type);
      if (find && find.value === stat.value) {
        return;
      }
      const value = max - stat.value;
      if (value === 0) {
        return;
      }
      const newStat = new EnchantStepStat(this, stat.itemBase, stat.type, value);
      newStats.push(newStat);
    });
    newStats.forEach(stat => {
      const t = this.stat(stat.itemBase, stat.type);
      if (t) {
        t.value = stat.value;
      } else {
        this.stats.push(stat);
      }
    });
  }

  /**
   * check whether the cost of potential will reduce after modify type
   * @param autoFix - if return value greater than autoFix, it will auto modify type to optimize
   * @returns number between -2 and 2
   *                    - 2: cost will reduce
   *                    - 1: TYPE_EACH is unnecessary
   *                    - 0: potential cost will not reduce, but cost may reduce if stat.value increased
   *                    - -1: cost will not reduce
   *                    - -2: stats.length != 1 or cost <= 0
   */
  optimizeType(autoFix: number = 2): number {
    if (this.stats.length !== 1) {
      return -2;
    }
    const oldType = this.type;
    const check = (() => {
      const old = this.potentialCost;
      if (old <= 0) {
        return -2;
      }
      this.type = this.type === EnchantStepTypes.Normal ? EnchantStepTypes.Each : EnchantStepTypes.Normal;
      if (this.potentialCost > old) {
        return -1;
      }
      if (this.potentialCost === old) {
        if (oldType === EnchantStepTypes.Each) {
          return 1;
        } else if (this.potentialExtraRate > 1) {
          return 0;
        }
        return -1;
      }
      return 2;
    })();
    if (check <= autoFix) {
      this.type = oldType;
    }
    return check;
  }

  toString() {
    return `${this.type === EnchantStepTypes.Each ? '@' : '#'}|${this.stats.map(stat => stat.showBase()).join(', ')}|${this.remainingPotential}pt`;
  }
}

class EnchantStat {
  itemBase: EnchantItem;
  stat: Stat;

  constructor(itemBase: EnchantItem, type: StatNormalTypes, v: number) {
    this.itemBase = itemBase;
    this.stat = itemBase.statBase.createStat(type, v);
  }

  get value(): number {
    return this.stat.value as number;
  }

  /** @param {number} v */
  set value(v: number) {
    this.stat.value = v;
  }

  /** @return {string} */
  get baseName(): string {
    return this.stat.baseName;
  }

  get type(): StatNormalTypes {
    return this.stat.type as StatNormalTypes;
  }

  get statId(): string {
    return this.stat.statId;
  }

  get limit() {
    return this.itemBase.getLimit(this.type);
  }

  get originalPotential() {
    return this.itemBase.getOriginalPotential(this.type);
  }

  get potentialConvertThreshold() {
    return this.itemBase.getPotentialConvertThreshold(this.type);
  }

  show(): string {
    return this.stat.show();
  }

  add(value: number) {
    return this.stat.add(value);
  }

  equals(estat: EnchantStat | EnchantStepStat): boolean {
    return this.stat.equals(estat.stat);
  }

  copy() {
    return new EnchantStat(this.itemBase, this.type, this.value);
  }

  /**
   * calc material point cost of from -> old. order of params has no effect.
   */
  calcMaterialPointCost(from: number, to: number): number {
    if (from > to) {
      const t = from;
      from = to;
      to = t;
    }

    const smithlv = STATE.Character.smithLevel;
    const r = 100 - Math.floor(smithlv / 10) - Math.floor(smithlv / 50);
    const bv = this.itemBase.getMaterialPointValue(this.type);

    const calc = (_from: number, _to: number) => {
      _to = Math.abs(_to);
      _from = Math.abs(_from);
      if (_from > _to) {
        [_from, _to] = [_to, _from];
      }
      return Array(_to - _from).fill(0)
        .map((item, idx) => idx + _from + 1)
        .reduce((item1, item2) => item1 + Math.floor(item2 * item2 * bv * r / 100), 0);
    };

    return from * to >= 0 ? calc(from, to) : calc(from, 0) + calc(0, to);
  }

  showAmount(type: 'current' | 'base' = 'current', previousValue: number = 0): string {
    const [unitValue, unitValue2] = this.itemBase.getUnitValue(this.type);
    const convertThreshold = this.potentialConvertThreshold;
    let v = this.value + previousValue;

    const sign = v < 0 ? -1 : 1;
    v *= sign;

    let v2 = 0;
    if (v > convertThreshold) {
      v2 = v - convertThreshold;
      v = convertThreshold;
    }

    if (type === 'base') {
      let pv = previousValue * sign, pv2 = 0;
      if (pv > convertThreshold) {
        pv2 = pv - convertThreshold;
        pv = convertThreshold;
      }
      v -= pv;
      v2 -= pv2;
    }

    v *= sign;
    v2 *= sign;

    return this.stat.show(v * unitValue + v2 * unitValue2);
  }
}


class EnchantStepStat extends EnchantStat {
  static POTENTIAL_CONVERT_DEFAULT_THRESHOLD = 20;

  private _parent: EnchantStep;

  constructor(parent: EnchantStep, itemBase: EnchantItem, type: StatNormalTypes, value: number) {
    super(itemBase, type, value);
    this._parent = parent;
  }

  save(): EnchantStepStatSaveData {
    return {
      type: EnchantStepStatTypesList.indexOf(this.type),
      value: this.value,
      base: this.itemBase.statBase.baseName,
    };
  }

  static load(categorys: EnchantCategory[], step: EnchantStep, data: EnchantStepStatSaveData) {
    let itemBase;
    categorys.find(category => {
      itemBase = category.items.find(item => item.statBase.baseName === data.base);
      return itemBase;
    });
    if (!itemBase) {
      console.warn(`can not find the EnchantItem "${data.base}" when load EnchantStepStat`);
      return null;
    }
    const type = EnchantStepStatTypesList[data.type];
    return new EnchantStepStat(step, itemBase, type, data.value);
  }

  override get value() {
    return this.stat.value;
  }

  override set value(value: number) {
    const eqstat = this.belongEquipment.stat(this.itemBase, this.type);
    const [min, max] = this.limit;
    const ov = eqstat.add(-1 * this.value);
    if (ov + value > max)
      value = max - ov;
    if (ov + value < min)
      value = min - ov;

    this.stat.value = value;
  }


  get index(): number {
    return this._parent.stats.indexOf(this);
  }

  get valid(): boolean {
    if (this._parent.type === EnchantStepTypes.Each && this.index !== 0) {
      return false;
    }
    if (this.itemBase.belongCategory.weaponOnly && this.belongEquipment.fieldType !== EnchantEquipmentTypes.MainWeapon) {
      return false;
    }
    return true;
  }

  get belongEquipment(): EnchantEquipment {
    return this._parent.belongEquipment;
  }

  get belongStep() {
    return this._parent;
  }

  get potential() {
    return this.itemBase.getPotential(this.type, this.belongEquipment);
  }

  get potentialCost(): number {
    const prev = this.previousStepStatValue;

    if (this._parent.type === EnchantStepTypes.Normal)
      return this.calcPotentialCost(this.value, prev);
    else {
      const er = this._parent.potentialExtraRate;

      let sv = this._parent.step || 1;
      const v = this.value;
      let res = 0,
        cur = 0;
      while (cur !== v) {
        if ((sv > 0 && cur + sv > v) || (sv < 0 && cur + sv < v)) {
          sv = v - cur;
        }
        res += this._parent.realPotentialCost(this.calcPotentialCost(sv, cur + prev) * er);
        cur += sv;
      }
      return res;
    }
  }

  get finalPotentialEffect(): number {
    return this._parent.type === EnchantStepTypes.Normal ?
      -1 * this.potentialCost * this._parent.potentialExtraRate :
      -1 * this._parent.potentialCost;
  }

  get materialPointCost(): MaterialPointCost {
    const from = this.previousStepStatValue,
      to = from + this.value;
    return {
      type: this.itemBase.materialPointType,
      value: this.calcMaterialPointCost(from, to),
    };
  }

  get previousStepStatValue(): number {
    const stat = this.belongEquipment
      .stat(this.itemBase, this.type, this._parent.index - 1);
    return stat ? stat.value : 0;
  }

  private _handleShow(type: 'current' | 'base' | 'each'): string {
    if (type === 'current' || type === 'base') {
      const prev = this.previousStepStatValue;
      return this.showAmount(type, prev);
    } else if (type === 'each') {
      return this.stat.show(this.belongStep.step);
    }

    return this.stat.show();
  }

  showCurrent() {
    return this._handleShow('current');
  }

  showBase() {
    return this._handleShow('base');
  }

  showEach() {
    return this._handleShow('each');
  }

  calcPotentialCost(value: number, pre: number = 0): number {
    const p = this.potential;
    const convertThreshold = this.itemBase.getPotentialConvertThreshold(this.type);

    const sign = value < 0 ? -1 : 1;

    let v2 = 0;
    if (pre * sign <= convertThreshold) {
      value += pre;
      value *= sign;

      if (value > convertThreshold) {
        v2 = value - convertThreshold;
        value = convertThreshold;
      }
      value *= sign;
      v2 *= sign;

      value -= pre;
    } else {
      v2 = value;
      value = 0;
    }

    const r = (5 + STATE.Character.tec / 10);
    return (value + v2) >= 0 ?
      value * p + v2 * p * 2 :
      Math.ceil((((value * p) + (v2 * p) / 2) * r) / 100);
  }

  /**
   * remove this stat from step
   */
  remove(): void {
    this._parent.stats.splice(this.index, 1);
    this.belongEquipment.refreshStats();
  }

  pure(): EnchantStat {
    return super.copy();
  }
}

export { EnchantStat, EnchantStepStat, EnchantStep, EnchantEquipment, EnchantBuild };