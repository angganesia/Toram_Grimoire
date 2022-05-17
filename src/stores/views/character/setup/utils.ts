import { isNumberString } from '@/shared/utils/string'
import { computeFormula } from '@/shared/utils/data'

import { Character } from '@/lib/Character/Character'
import { SkillBranchItem } from '@/lib/Skill/SkillComputingContainer'
import { EquipmentTypes } from '@/lib/Character/CharacterEquipment/enums'
import { EquipmentFieldTypes } from '@/lib/Character/Character/enums'
import { ResultContainerStat } from '@/lib/Skill/SkillComputingContainer/ResultContainer'
import { Stat } from '@/lib/Character/Stat'

import DisplayDataContainer from '@/views/SkillQuery/skill/branch-handlers/utils/DisplayDataContainer'

import { SkillResult } from '.'

export function getSkillStatContainerValid(character: Character | null, skillResult: SkillResult, statContainer: ResultContainerStat): boolean {
  if (statContainer.conditionValue) {
    const resultsState = skillResult.root
    const vars = {
      $skill: {
        id: resultsState.skill.skillId,
        range: resultsState.basicContainer ? getSkillRange(character, resultsState.basicContainer) : -1,
      },
      $self: {
        id: statContainer.branch.parent.parent.skill.skillId,
      },
      $branch: {
        id: skillResult.container.branchItem.id,
        prop: skillResult.container.branchItem.prop,
      },
    }
    return computeFormula(statContainer.conditionValue, vars, false) as boolean
  }
  return true
}

function getSkillRange(character: Character | null, basicContainer: DisplayDataContainer<SkillBranchItem>): number {
  if (!character) {
    return 0
  }
  const skillRange = basicContainer.getValue('range')

  let rangeValue = basicContainer.getOrigin('range')
  const rangeValueWeaponMap = new Map([
    ['magic_device', EquipmentTypes.MagicDevice],
    ['katana', EquipmentTypes.Katana],
    ['knuckle', EquipmentTypes.Knuckle],
  ])
  if (rangeValueWeaponMap.has(rangeValue)) {
    const eqType = rangeValueWeaponMap.get(rangeValue)!
    if (character.checkFieldEquipmentType(EquipmentFieldTypes.MainWeapon, eqType)) {
      rangeValue = 'main'
    } else if (character.checkFieldEquipmentType(EquipmentFieldTypes.SubWeapon, eqType)) {
      rangeValue = 'sub'
    }
  }

  if (rangeValue === 'main' || rangeValue === 'sub') {
    const field = character.equipmentField(rangeValue === 'main' ? EquipmentFieldTypes.MainWeapon : EquipmentFieldTypes.SubWeapon)
    const weaponRangeAdd = field.equipment?.stats.find(stat => stat.baseId === 'weapon_range')?.value ?? 0
    return getWeaponBaseRange(field.equipmentType) + weaponRangeAdd
  } else if (isNumberString(skillRange)) {
    return parseFloat(skillRange)
  }
  return 0
}

function getWeaponBaseRange(main: EquipmentTypes): number {
  const mapping: Partial<Record<EquipmentTypes, number>> = {
    [EquipmentTypes.Empty]: 1,
    [EquipmentTypes.OneHandSword]: 2,
    [EquipmentTypes.TwoHandSword]: 3,
    [EquipmentTypes.Staff]: 2,
    [EquipmentTypes.MagicDevice]: 6,
    [EquipmentTypes.Bow]: 10,
    [EquipmentTypes.Bowgun]: 5,
    [EquipmentTypes.Knuckle]: 8,
    [EquipmentTypes.Halberd]: 2,
    [EquipmentTypes.Katana]: 4,
  }
  return mapping[main] ?? 0
}

export function mergeStats(allStats: Map<string, Stat>, stats: Stat[]): void {
  stats.forEach(stat => {
    if (allStats.has(stat.statId)) {
      allStats.get(stat.statId)!.add(stat.value)
    } else {
      allStats.set(stat.statId, stat.clone())
    }
  })
}
