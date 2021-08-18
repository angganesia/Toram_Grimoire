
import { CalcItemContainer, Calculation } from './index';

/**
 * @callback CalcResult
 * @param {CalcItemContainer} itemContainer
 * @param {CalcItemBaseContainer} baseContainer
 * @returns {number}
 */
/**
 * @callback CurrentItemIdGetter
 * @param {CalcItemContainer} itemContainer
 * @param {CalcItemBaseContainer} baseContainer
 * @returns {string}
 */

/**
 * @typedef CalcStruct
 * @type {Object}
 * @property {CalcStructItem} root
 * @property {string[]} options
 */
/**
 * @typedef CalcStructItem
 * @type {CalcStructSingle|CalcStructMultiple|string}
 */
/**
 * @typedef CalcStructSingle
 * @type {Object}
 * @property {"*"|"+"} operator
 * @property {CalcStructItem} left
 * @property {CalcStructItem} right
 */
/**
 * @typedef CalcStructMultiple
 * @type {Object}
 * @property {"***"|"+++"} operator
 * @property {CalcStructItem[]} list
 */

/** */
class CalculationBase {
  constructor() {
    /** @type {Map<string, CalcItemBaseContainer>} */
    this.containers = new Map();

    /** @type {CalcStruct} */
    this.calcStruct = null;
  }

  /**
   * @param {string} id - unique ID
   * @param {symbol} category - CalcItemContainer.CATEGORY_X
   * @param {symbol} type - CalcItemContainer.TYPE_X
   * @returns {CalcItemBaseContainer} this
   */
   appendContainer(id, type) {
    const container = new CalcItemBaseContainer(this, id, type);
    this.containers.set(id, container);
    return container;
  }

  /**
   * @param {CalcStruct} struct
   */
  setCalcStruct(struct) {
    this.calcStruct = struct;
  }

  /**
   * @param {string} name
   * @returns {Calculation}
   */
  createCalculation(name) {
    return new Calculation(this, name);
  }

  /**
   * @param {Calculation} calculation
   */
  result(calculation) {
    if (!this.calcStruct) {
      return 0;
    }
    /**
     * @param {CalcStructItem} item
     * @returns {number}
     */
    const handle = item => {
      if (typeof item === 'string') {
        const container = calculation.containers.get(item);
        const res = container.result();
        if (!container.enabled) {
          return container.base.isMultiplier ? container.base.disabledValue / 100 : container.base.disabledValue;
        }
        return container.base.isMultiplier ? res / 100 : res;
      }
      if (item.operator === '+') {
        return handle(item.left) + handle(item.right);
      }
      if (item.operator === '+') {
        return handle(item.left) * handle(item.right);
      }
      if (item.operator === '+++') {
        return item.list.reduce((cur, subItem) => cur + handle(subItem), 0);
      }
      if (item.operator === '***') {
        return item.list.reduce((cur, subItem) => cur * handle(subItem), 1);
      }
    }
    return handle(this.calcStruct.root);
  }
}

class CalcItemBaseContainer {
  static TYPE_NORMAL = Symbol('normal');
  static TYPE_OPTIONS = Symbol('options');

  /**
   * @param {CalculationBase} parent
   * @param {string} id
   * @param {symbol} [type]
   */
  constructor(parent, id, type) {
    /** @type {string} */
    this.id = id;

    /** @type {CalculationBase} @private */
    this._parent = parent;

    /** @type {symbol} */
    this.type = type ?? CalcItemBaseContainer.TYPE_NORMAL;

    /** @type {Map<string, CalcItemBase>} */
    this.items = new Map();

    /** @type {CalcResult} @private */
    this._calcResult = null;

    /** @type {CurrentItemIdGetter} */
    this.getCurrentItemId = null;

    this.isMultiplier = false;

    /** @type {number} */
    this._disabledValue = null;

    this.controls = {
      toggle: true,
    };
  }

  get disabledValue() {
    if (this._disabledValue !== null) {
      return this._disabledValue;
    }
    return this.isMultiplier ? 100 : 0;
  }

  /**
   * @param {string} id
   * @returns {CalcItemBase}
   */
  appendItem(id) {
    const item = new CalcItemBase(this, id);
    if (this.isMultiplier) {
      item.setRange(0, null, 10)
        .setDefaultValue(100)
        .setUnit('%');
    }
    this.items.set(id, item);
    return item;
  }

  /**
   * @param {CalcResult} value
   */
   setCalcResult(value) {
    this._calcResult = value;
  }

  /**
   * @param {CurrentItemIdGetter} value
   */
   setGetCurrentItemId(value) {
    this.getCurrentItemId = value;
  }

  setDisabledValue(value) {
    this._disabledValue = value;
  }

  /**
   * mark this container is multipler, must call before append items.
   *
   * For all items:
   * - `setRange(0, null, 10)`
   * - `setDefaultValue(100)`
   * - `setUnit("%")`
   */
   markMultiplier() {
    this.isMultiplier = true;
  }

  /**
   * @param {CalcItemContainer} itemContainer
   */
  result(itemContainer) {
    const res = (() => {
      if (this._calcResult) {
        return this._calcResult(itemContainer, this);
      }
      return itemContainer.currentItem.value;
    })();
    return Math.floor(res);
  }
}

class CalcItemBase {
  /**
   * @param {CalcItemBaseContainer} parent
   * @param {string} id
   * @param {string} unit
   */
  constructor(parent, id) {
    /** @type {CalcItemBaseContainer} */
    this._parent = parent;

    /** @type {string} */
    this.id = id;

    /** @type {string} */
    this.unit = null;

    /** @type {number} */
    this.min = null;

    /** @type {number} */
    this.max = null;

    /** @type {number} */
    this.step = 1;

    /** @type {number} */
    this.defaultValue = 0;
  }

  get belongContainer() {
    return this._parent;
  }

  /**
   * @param {number} min
   * @param {number} [max=null]
   * @param {number} [step=1]
   * @returns {CalcItemBase}
   */
  setRange(min, max = null, step = 1) {
    this.min = min;
    this.max = max;
    this.step = step;
    return this;
  }

  /**
   * @param {number} value
   * @returns {CalcItemBase}
   */
  setDefaultValue(value) {
    this.defaultValue = value;
    return this;
  }

  /**
   * @param {string} value
   */
  setUnit(value) {
    this.unit = value;
  }
}

export { CalcItemBase, CalculationBase, CalcItemBaseContainer };