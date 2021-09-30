import { isNumberString } from '@/shared/utils/string';
import { GetLangHandler } from '@/shared/services/Language';

import { SkillBranchItem } from '@/lib/Skill/SkillComputingContainer';
import {
  computeBranchValue,
  computedBranchHelper,
  ComputedBranchHelperResult,
  handleBranchTextAttrs,
  handleBranchValueAttrs,
} from '@/lib/Skill/SkillComputingContainer/compute';
import type { HandleBranchValueAttrsMap, HandleBranchTextAttrsMap } from '@/lib/Skill/SkillComputingContainer/compute';
import { ResultContainer } from '@/lib/Skill/SkillComputingContainer/ResultContainer';

function cloneBranchAttrs(branchItem: SkillBranchItem): Record<string, string> {
  const attrs = {} as Record<string, string>;
  Object.entries(branchItem.attrs).forEach(([key, value]) => {
    attrs[key] = value;
  });
  return attrs;
}

interface HandleBranchLangAttrsOptions {
  prefix?: string;
  type?: 'normal' | 'value';
  afterHandle?: ((value: string) => string) | null;
}
interface HandleBranchLangAttrsMap {
  [key: string]: HandleBranchLangAttrsOptions | null;
}
function handleBranchLangAttrs<AttrMap extends HandleBranchLangAttrsMap>(
  lang: GetLangHandler,
  branchItem: SkillBranchItem,
  helper: ComputedBranchHelperResult,
  attrs: Record<string, string>,
  attrMap: AttrMap,
): Record<keyof AttrMap, ResultContainer> {
  const attrValues = {} as Record<keyof AttrMap, ResultContainer>;
  const attrKeys = Object.keys(attrMap) as (keyof AttrMap)[];
  attrKeys.forEach((attrKey) => {
    const { type = 'normal', prefix = '', afterHandle = null } = (attrMap[attrKey] || {}) as HandleBranchLangAttrsOptions;
    const value = attrs[attrKey as string];
    let resultStr: string;
    if (type === 'value') {
      const resultValue = computeBranchValue(value, helper);
      const sign = isNumberString(resultValue) && parseFloat(resultValue) < 0 ? 'negative' : 'positive';
      const displayValue = sign === 'negative' ? -1 * parseFloat(resultValue) : resultValue;
      resultStr = lang(`${branchItem.name + prefix}/${attrKey}/${sign}`, [displayValue.toString()]);
    } else {
      let displayValue = value;
      if (displayValue === '1' || displayValue === '0') {
        displayValue = displayValue === '1' ? 'true' : 'false';
      }
      let preName = branchItem.name + prefix;
      preName = branchItem.mainBranch ? branchItem.mainBranch.name + ': ' + preName : preName;
      const result = lang(`${preName}/${attrKey}/${displayValue}`);
      resultStr = afterHandle ? afterHandle(result) : result;
    }
    attrValues[attrKey] = new ResultContainer(value, resultStr);
  });
  return attrValues;
}
type HandleDisplayDataOptionFilterValidation = (value: string) => boolean;
interface HandleDisplayDataOptionFilterItem {
  validation: HandleDisplayDataOptionFilterValidation;
  calc?: boolean;
  defaultValue?: string;
}
interface HandleDisplayDataOptionFilters {
  [key: string]: HandleDisplayDataOptionFilterValidation | HandleDisplayDataOptionFilterItem;
}
interface HandleDisplayDataOptions {
  values?: HandleBranchValueAttrsMap;
  texts?: HandleBranchTextAttrsMap;
  langs?: HandleBranchLangAttrsMap | string[];
  filters?: HandleDisplayDataOptionFilters;
  langHandler?: GetLangHandler;
}
function handleDisplayData(branchItem: SkillBranchItem, attrs: Record<string, string>, {
  values = {},
  texts = {},
  langs = {},
  filters = {},
  langHandler,
}: HandleDisplayDataOptions) {
  const helper = computedBranchHelper(branchItem, [
    ...Object.keys(values),
    ...branchItem.stats.map(stat => stat.value),
  ]);

  Object.entries(filters).forEach(([key, value]) => {
    const attrValue = attrs[key];
    if (typeof value === 'function') {
      value = { validation: value };
    }
    const { validation, calc = false, defaultValue = null } = value;
    if (attrValue === undefined) {
      if (defaultValue !== null) {
        attrs[key] = defaultValue;
      }
      return;
    }
    const validatedValue = calc ? computeBranchValue(attrValue, helper) : attrValue;
    if (!validation(validatedValue)) {
      if (defaultValue !== null) {
        attrs[key] = defaultValue;
      } else {
        delete attrs[key];
        delete values[key];
        delete texts[key];
      }
    }
  });

  if (Array.isArray(langs)) {
    langs = keysToAttrMap<HandleBranchLangAttrsMap>(langs);
  }

  const valueDatas = handleBranchValueAttrs(helper, attrs, values);
  const textDatas = handleBranchTextAttrs(helper, attrs, texts);
  const langDatas = langHandler ? handleBranchLangAttrs(langHandler, branchItem, helper, attrs, langs) : {};

  const containerResult = {
    ...valueDatas,
    ...textDatas,
    ...langDatas,
  };

  const result = {} as Record<string, string>;
  Object.entries(containerResult).forEach(([key, value]) => {
    result[key] = value.result;
  });

  return result;
}

function keysToAttrMap<T extends Record<string, any>>(keys: string[]) {
  const newAttrMap = {} as Record<string, any>;
  keys.forEach(key => newAttrMap[key] = null);
  return newAttrMap as T;
}

export { cloneBranchAttrs, handleDisplayData, keysToAttrMap };
export type {
  HandleDisplayDataOptionFilters,
  HandleBranchLangAttrsMap,
};

