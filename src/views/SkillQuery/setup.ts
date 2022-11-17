import {
  computed,
  nextTick,
  provide,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Grimoire from '@/shared/Grimoire'

import GlossaryTag from '@/lib/Glossary/GlossaryTag'
import { RegistletItemBaseSkill } from '@/lib/Registlet/Registlet'
import { Skill } from '@/lib/Skill/Skill'
import SkillComputingContainer, {
  SkillBranchItem,
  SkillEffectItem,
  SkillEffectItemHistory,
  SkillItem,
} from '@/lib/Skill/SkillComputingContainer'

import { ComputingContainerInjectionKey } from './injection-keys'
import { TAG_BUTTON_CLASS_NAME, findStackState } from './utils'

export function setupSkillTag(tagContent: Ref<{ $el: HTMLElement } | null>) {
  const { t } = useI18n()

  const currentTags: Ref<GlossaryTag[]> = ref([])
  const currentTagIndex = ref(-1)

  const currentTag = computed(() => {
    if (currentTags.value.length === 0) {
      return null
    }
    return currentTags.value[currentTagIndex.value]
  })

  const changeTag = (offset: number) => {
    currentTagIndex.value += offset
  }

  const findTag = (tagName: string): GlossaryTag | null => {
    const tag = Grimoire.Glossary.tags.find(
      item => item.name.toLowerCase() === tagName.toLowerCase()
    )
    return tag || null
  }

  const getTagText = (el: HTMLElement) =>
    el.getAttribute('data-tag') || el.innerText

  const appendTag = (tagName: string): void => {
    const tag = findTag(tagName)
    if (tag) {
      currentTags.value.splice(
        currentTagIndex.value + 1,
        currentTags.value.length - currentTagIndex.value,
        tag
      )
    } else {
      const emptyTag = new GlossaryTag(tagName)
      emptyTag.appendRow('caption', t('skill-query.tag.no-data-tips'))
      currentTags.value.push(emptyTag)
    }
    currentTagIndex.value = currentTags.value.length - 1
  }

  const clearTag = () => {
    currentTags.value = []
  }

  watch(currentTagIndex, async () => {
    await nextTick()
    if (
      tagContent.value &&
      tagContent.value.$el &&
      tagContent.value.$el.querySelectorAll
    ) {
      const click = function (this: HTMLElement, error: Event) {
        error.stopPropagation()
        appendTag(getTagText(this))
      }
      tagContent.value.$el
        .querySelectorAll(`.${TAG_BUTTON_CLASS_NAME}[data-tag]`)
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
    appendTag(getTagText(el))
  }

  return {
    currentTags,
    currentTag,
    currentTagIndex,
    changeTag,
    tagButtonHover,
  }
}

export interface SkillRegistletItemState {
  index: number
  item: RegistletItemBaseSkill
  level: number
}

export function setupComputingContainer(skillRef: Ref<Skill | null>) {
  const skillRegistletItemsStates = new Map<Skill, SkillRegistletItemState[]>()
  const getSkillRegistletItemsState = (
    skill: Skill
  ): SkillRegistletItemState[] => {
    if (!skillRegistletItemsStates.has(skill)) {
      const registletItems = Grimoire.Registlet.getRegistletItemsBySkill(skill)
      skillRegistletItemsStates.set(
        skill,
        registletItems.map((registletItem, index) => {
          const maxLevel = registletItem.maxLevel
          return reactive({
            index,
            item: registletItem,
            level: ref(maxLevel),
          }) as SkillRegistletItemState
        })
      )
    }
    return skillRegistletItemsStates.get(skill)!
  }

  const computingContainer = new SkillComputingContainer()
  const FORMULA_REPLACED_VARS = [
    'BSTR',
    'BINT',
    'BAGI',
    'BVIT',
    'BDEX',
    'TEC',
    'CRT',
    'LUK',
    'MEN',
    'STR',
    'INT',
    'AGI',
    'VIT',
    'DEX',
    'shield_refining',
    'dagger_atk',
    'target_def',
    'target_level',
    'guard_power',
  ]
  FORMULA_REPLACED_VARS.forEach(varName => {
    computingContainer.handleFormulaExtends.texts['$' + varName] =
      Grimoire.i18n.t(`skill-query.branch.formula-replaced-text.${varName}`)
  })
  computingContainer.varGetters.registletLevel = skill =>
    getSkillRegistletItemsState(skill).map(state => state.level)

  const currentSkillItem = shallowRef<SkillItem | null>(null)
  watch(
    skillRef,
    newValue => {
      currentSkillItem.value = newValue ? new SkillItem(newValue) : null
      const vars = {
        slv: computingContainer.vars.skillLevel,
        clv: computingContainer.vars.characterLevel,
      }
      currentSkillItem.value?.effectItems.forEach(effectItem =>
        effectItem.resetStackStates(vars)
      )
    },
    { immediate: true }
  )

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

  provide(ComputingContainerInjectionKey, {
    rootComputingContainer: computingContainer,
    setStackValue,
    getSkillRegistletItemsState,
  })

  return {
    currentSkillItem,
    computingContainer,
  }
}
