import { ref, provide, watch, nextTick, reactive } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Grimoire from '@/shared/Grimoire'

import SkillComputingContainer, { SkillBranchItem, SkillEffectItem, SkillEffectItemHistory, SkillItem } from '@/lib/Skill/SkillComputingContainer'
import { Skill } from '@/lib/Skill/Skill'
import Tag from '@/lib/Tag/Tag'

import { findStackState, TAG_BUTTON_CLASS_NAME } from './utils'
import { ComputingContainerInjectionKey } from './injection-keys'

export function setupSkillTag(tagContent: Ref<{ $el: HTMLElement } | null>) {
  const { t } = useI18n()

  const currentTags: Ref<Tag[]> = ref([])

  const findTag = (tagName: string): Tag | null => {
    const tag = Grimoire.Tag.tagList.find(item => item.name === tagName)
    return tag || null
  }

  const emptyTag = new Tag('0.0')
  emptyTag.appendFrame('caption', t('skill-query.tag.no-data-tips'))
  const appendTag = (tagName: string): void => {
    const tag = findTag(tagName)
    if (tag) {
      currentTags.value.push(tag)
    } else {
      currentTags.value.push(emptyTag)
    }
  }

  const clearTag = () => {
    currentTags.value = []
  }

  watch(currentTags, async () => {
    await nextTick()
    if (tagContent.value && tagContent.value.$el && tagContent.value.$el.querySelectorAll) {
      const click = function (this: HTMLElement, error: Event) {
        error.stopPropagation()
        appendTag(this.innerText)
      }
      tagContent.value.$el.querySelectorAll('.' + TAG_BUTTON_CLASS_NAME)
        .forEach(el => {
          if (el.getAttribute('data-tag-listener-flag') === '1') {
            return
          }
          el.addEventListener('click', click)
          el.setAttribute('data-tag-listener-flag', '1')
        })
    }
  })

  const tagButtonHover = (el: HTMLElement) => {
    clearTag()
    appendTag(el.innerText)
  }

  return {
    currentTags,
    clearTag,
    tagButtonHover,
  }
}

export function setupComputingContainer(skill: Ref<Skill | null>) {
  const computingContainer = reactive(new SkillComputingContainer())
  const FORMULA_REPLACED_VARS = [
    'BSTR', 'BINT', 'BAGI', 'BVIT', 'BDEX', 'TEC',
    'STR', 'INT', 'AGI', 'VIT', 'DEX', 'shield_refining',
    'dagger_atk', 'target_def', 'target_level', 'guard_power',
  ]
  FORMULA_REPLACED_VARS.forEach(varName => {
    computingContainer.handleFormulaExtends.texts['$' + varName] = Grimoire.i18n.t(`skill-query.branch.formula-replaced-text.${varName}`)
  })

  const currentSkillItem: Ref<SkillItem | null> = ref(null)
  watch(skill, newValue => {
    currentSkillItem.value = newValue ? computingContainer.createSkillItem(newValue) : null
  }, { immediate: true })

  const setStackValue = (branchItem: SkillBranchItem, value: number) => {
    const stackId = branchItem.stackId
    if (typeof stackId !== 'number') {
      return
    }
    const effect = branchItem.parent
    if (effect instanceof SkillEffectItem) {
      effect.parent.effectItems.forEach(effectItem => {
        const stackState = findStackState(effectItem, stackId)
        if (stackState) {
          stackState.value = value
        }
      })
    } else if (effect instanceof SkillEffectItemHistory) {
      const stackState = findStackState(effect, stackId)
      if (stackState) {
        stackState.value = value
      }
    }
  }

  provide(ComputingContainerInjectionKey, { setStackValue })

  return {
    currentSkillItem,
    computingContainer,
  }
}
