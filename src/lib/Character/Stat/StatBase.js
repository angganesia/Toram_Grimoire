import GetLang from "@Services/Language";
import { isNumberString } from "@Utils/string";

function Lang(s) {
  return GetLang('stat base/' + s);
}

class StatBase {
  constructor(bn, t, hm, order) {
    this.baseName = bn;
    this.text = t;
    this.hasMultiplier = hm;
    this.order = order;
    this.attributes = {};
  }
  appendAttribute(n, v) {
    if (n && v !== null && v !== void 0)
      this.attributes[n] = v;
    return this;
  }
  title(type) {
    if (type == StatBase.TYPE_CONSTANT)
      return this.hasMultiplier || this.text[this.text.length-1] == '%' ?
        this.text :
        this.text + (
          (this.attributes['constant_formula'] && this.attributes['constant_formula'].includes('$u')) || !this.attributes['constant_formula'] ?
          '%' :
          ''
        );
    if (type == StatBase.TYPE_MULTIPLIER)
      return this.text + '%';
  }
  show(type, v) {
    const calc = isNumberString(v);
    if (typeof v !== 'number' && calc)
      v = parseFloat(v);
    const handleFormula = (formula, unit) => {
      const isPos = v >= 0 || !calc; 
      const sign = isPos ? '+' : '';
      formula = formula.split('::')[isPos ? 0 : 1] || formula;
      let res = formula
        .replace('$t', this.text)
        .replace('$u', unit)
        .replace('$s', sign)
        .replace('$v', calc ? Math.floor(v) : v)
        .replace(/\$(\d+)d/, (m, m1) => v.toFixed(parseInt(m1)));
      return res;
    }
    switch (type) {
      case StatBase.TYPE_CONSTANT:
        return handleFormula(this.attributes['constant_formula'] || '$t$s$v$u', this.hasMultiplier ? '' : '%');
      case StatBase.TYPE_MULTIPLIER:
        return handleFormula(this.attributes['multiplier_formula'] || '$t$s$v$u', '%');
      case StatBase.TYPE_TOTAL:
        return handleFormula(Lang('type total: preText') + '$t$s$v$u', '%');
    }
  }
  getShowData(type, v) {
    let title = '',
      tail = '';
    if (type == StatBase.TYPE_CONSTANT) {
      title = this.text;
      if (!this.hasMultiplier)
        tail = '%';
      if (this.attributes['constant_formula'] && !this.attributes['constant_formula'].includes('$u'))
        tail = '';
    } else if (type == StatBase.TYPE_MULTIPLIER) {
      title = this.text;
      tail = '%';
      if (this.attributes['multiplier_formula'] && !this.attributes['multiplier_formula'].includes('$u'))
        tail = '';
    } else if (type == StatBase.TYPE_TOTAL) {
      title = Lang('type total: preText') + this.text;
      tail = '%';
    }
    return {
      result: this.show(type, v),
      title,
      value: v,
      tail
    };
  }
  createStat(type, v) {
    if (!this.hasMultiplier && type == StatBase.TYPE_MULTIPLIER) {
      type = StatBase.TYPE_CONSTANT;
    }
    return new Stat(this, type, v);
  }
  checkBoolStat(type) {
    type = type || StatBase.TYPE_CONSTANT;
    return type == StatBase.TYPE_CONSTANT && this.attributes['constant_formula'] == '$t';
  }
}

StatBase.TYPE_CONSTANT = Symbol('constant');
StatBase.TYPE_MULTIPLIER = Symbol('multiplier');
StatBase.TYPE_TOTAL = Symbol('total');


StatBase.sortStats = function(stats, type='simple') {
  if (type === 'simple')
    stats.sort((a, b) => a.base.order - b.base.order);
  return stats;
};


class Stat {
  constructor(base, type, v = 0) {
    this.base = base;
    this.type = type;
    this.value = v;
  }

  get isBoolStat() {
    return this.base.checkBoolStat(this.type);
  }

  show(config, v) {
    if (v === void 0)
      v = this.value;
    return this.base.show(this.type, v, config);
  }
  getShowData() {
    return this.base.getShowData(this.type, this.value);
  }
  statValue(v) {
    if (v !== void 0)
      this.value = v;
    return this.value;
  }
  addStatValue(v) {
    this.value += v;
    return this.value;
  }
  baseName() {
    return this.base.baseName;
  }
  title() {
    return this.base.title(this.type);
  }
  /**
   * if input_stat.baseName == this.baseName and input_stat.type == this.type, return true.
   * (value do not have to be equal)
   * @param  {Stat} stat
   * @return {Boolean}
   */
  equals(stat) {
    return stat.base == this.base && stat.type == this.type;
  }
  copy() {
    return this.base.createStat(this.type, this.value);
  }
}

export { Stat, StatBase };