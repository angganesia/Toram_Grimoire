import { SkillBranchItem } from '@/lib/Skill/SkillComputingContainer'
import { HandleBranchValuePropsMap } from '@/lib/Skill/SkillComputingContainer/compute'
import { SkillBranchNames } from '@/lib/Skill/Skill/enums'
import { FormulaDisplayModes } from '@/lib/Skill/SkillComputingContainer/enums'

import { cloneBranchProps, HandleBranchLangPropsMap, handleDisplayData } from './utils'
import type { HandleDisplayDataOptionFilters } from './utils'
import MapContainer from './utils/MapContainer'

export default function AreaHandler<BranchItem extends SkillBranchItem>(branchItem: BranchItem, formulaDisplayMode?: FormulaDisplayModes) {
  const props = cloneBranchProps(branchItem)

  const basicBranch = branchItem.parent.branchItems.find(bch => bch.is(SkillBranchNames.Basic))
  props.set('@range', basicBranch?.prop('range') ?? '')

  const filters = new MapContainer<HandleDisplayDataOptionFilters>({
    'move_distance': value => !!value,
    'angle': value => !!value,
    'start_position_offsets': {
      validation: value => value !== '0',
      calc: true,
    },
    'end_position_offsets': {
      validation: value => value !== '0',
      calc: true,
    },
  })

  const valuePropsMap = new MapContainer<HandleBranchValuePropsMap>({
    'angle': '°',
    'start_position_offsets': 'm',
    'end_position_offsets': 'm',
    'move_distance': 'm',
  })

  if (props.get('effective_area') !== 'sector') {
    valuePropsMap.set('radius', 'm')
  }

  const langAttrsMap = new MapContainer<HandleBranchLangPropsMap>(['effective_area'])

  const pureValues = []
  if (props.has('@range') && props.get('@range') !== 'no_limit' && props.get('@range') !== 'main') {
    pureValues.push('@range')
  }

  const titles = formulaDisplayMode === FormulaDisplayModes.Normal ? [] : [
    'effective_area',
    'radius',
    'move_distance',
    'angle',
    'start_position_offsets',
    'end_position_offsets',
  ]

  const pureDatas = ['target_offsets', 'end_position']

  return handleDisplayData(branchItem, props, {
    filters: filters.value,
    values: valuePropsMap.value,
    langs: langAttrsMap.value,
    titles,
    pureValues,
    pureDatas,
    formulaDisplayMode,
  })
}
