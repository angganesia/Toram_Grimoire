import { SkillBranchItem, SkillBranchItemSuffix } from '@/lib/Skill/SkillComputingContainer'
import type { HandleBranchTextAttrsMap } from '@/lib/Skill/SkillComputingContainer/compute'

import { cloneBranchAttrs, handleDisplayData } from './utils'
import MapContainer from './utils/MapContainer'

export default function TextHandler<BranchItem extends SkillBranchItem | SkillBranchItemSuffix>(branchItem: BranchItem) {
  const attrs = cloneBranchAttrs(branchItem)
  const textAttrsMap = new MapContainer<HandleBranchTextAttrsMap>(['text'])

  return handleDisplayData(branchItem, attrs, {
    texts: textAttrsMap.value,
  })
}
