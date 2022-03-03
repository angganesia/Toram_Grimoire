import Grimoire from '@/shared/Grimoire'

import { Skill, SkillTree } from '@/lib/Skill/Skill'
import { SkillTypes } from '@/lib/Skill/Skill/enums'

import { SkillBuildState } from '../skill'

interface SkillState {
  level: number;
  starGemLevel: number;
  enabled: boolean;
}

interface SkillSaveData extends SkillState {
  skillId: string;
}

interface SkillBuildSaveData {
  name: string;
  skillStates: SkillSaveData[];
  selectedSkillTrees: string[];
}

let _skillBuildAutoIncreasement = 0
export class SkillBuild {
  /** Map<skill-id, skill-level> */
  protected _skillStatesMap: Map<Skill, SkillState>
  protected _skillTreesSet: Set<SkillTree>

  instanceId: number
  name: string

  constructor(name: string = '') {
    this.instanceId = _skillBuildAutoIncreasement
    _skillBuildAutoIncreasement += 1

    this.name = name
    this._skillStatesMap = new Map()
    this._skillTreesSet = new Set()
  }

  hasSkillState(skill: Skill) {
    return this._skillStatesMap.has(skill)
  }

  getSkillState(skill: Skill): SkillState {
    if (!this._skillStatesMap.has(skill)) {
      this._skillStatesMap.set(skill, {
        level: 0,
        starGemLevel: 0,
        enabled: skill.type === SkillTypes.Passive,
      })
    }
    const state = this._skillStatesMap.get(skill)!
    return state as SkillState
  }

  getSkillLevel(skill: Skill): number {
    return this.getSkillState(skill).level
  }

  addSkillLevel(skill: Skill, level: number) {
    const state = this.getSkillState(skill)
    let levelSet = state.level + level
    levelSet = Math.min(10, Math.max(levelSet, 0))
    state.level = levelSet
    this.regressSkillTree(skill, levelSet)
  }

  addStarGemLevel(skill: Skill, level: number) {
    const state = this.getSkillState(skill)
    let levelSet = state.starGemLevel + level
    levelSet = Math.min(10, Math.max(levelSet, 0))
    state.starGemLevel = levelSet
  }

  regressSkillTree(start: Skill, level: number) {
    if (level < 5) {
      const stk: Skill[] = [start]
      while (stk.length !== 0) {
        const current = stk.pop()!
        current.parent.skills.forEach(skill => {
          if (skill.previous === current.id) {
            stk.push(skill)
            this.getSkillState(skill).level = 0
          }
        })
      }
    }
    if (level > 0) {
      let current = start
      while (current.previous !== -1) {
        const pre = current.parent.skills.find(sk => sk.id === current.previous)
        if (!pre) {
          break
        }
        current = pre
        const state = this.getSkillState(current)
        if (state.level < 5) {
          state.level = 5
        }
      }
    }
  }

  get selectedSkillTrees(): SkillTree[] {
    return [...this._skillTreesSet.keys()].sort((item1, item2) => item1.skillTreeId.localeCompare(item2.skillTreeId))
  }

  get validSkills(): Skill[] {
    return [...this._skillStatesMap.entries()]
      .filter(([, state]) => state.level !== 0 && state.enabled)
      .map(([skill]) => skill)
  }

  get allSkills(): Skill[] {
    return [...this._skillStatesMap.keys()]
  }

  get skillPointSum() {
    let level = 0
    let starGemLevel = 0
    ;[...this._skillStatesMap.values()].forEach(state => {
      level += state.level
      starGemLevel += Math.max(state.starGemLevel - state.level, 0)
    })

    return {
      level,
      starGemLevel,
    }
  }

  toggleSkillTreeSelected(skillTree: SkillTree) {
    if (this._skillTreesSet.has(skillTree)) {
      this._skillTreesSet.delete(skillTree)
    } else {
      this._skillTreesSet.add(skillTree)
    }
  }

  clone(): SkillBuild {
    return SkillBuild.load(this.save())
  }

  save(): SkillBuildSaveData {
    const skillStates = [...this._skillStatesMap.entries()]
      .filter(([, state]) => state.level !== 0 || state.starGemLevel !== 0)
      .map(([skill, state]) => ({
        skillId: skill.skillId,
        enabled: state.enabled ?? true,
        level: state.level,
        starGemLevel: state.starGemLevel,
      }))
    const selectedSkillTrees = [...this._skillTreesSet.keys()].map(skillTree => skillTree.skillTreeId)
    return {
      name: this.name,
      skillStates,
      selectedSkillTrees,
    }
  }

  static load(data: SkillBuildSaveData): SkillBuild {
    const newBuild = new SkillBuild(data.name)
    data.selectedSkillTrees.forEach(skillTreeId => {
      let skillTree: SkillTree | null = null
      Grimoire.Skill.skillRoot.skillTreeCategorys.some(stc => {
        const find = stc.skillTrees.find(st => st.skillTreeId === skillTreeId)
        if (find) {
          skillTree = find
          return true
        }
        return false
      })
      if (skillTree) {
        newBuild._skillTreesSet.add(skillTree)
      }
    })
    data.skillStates.forEach(state => {
      let skill: Skill | null = null
      Grimoire.Skill.skillRoot.skillTreeCategorys.some(stc => {
        return stc.skillTrees.some(st => {
          const find = st.skills.find(_skill => _skill.skillId === state.skillId)
          if (find) {
            skill = find
            return true
          }
          return false
        })
      })
      if (skill) {
        const _state = newBuild.getSkillState(skill)
        _state.enabled = state.enabled
        _state.level = state.level
        _state.starGemLevel = state.starGemLevel
      }
    })
    return newBuild
  }

  static loadFromLagacy(buildState: SkillBuildState): SkillBuild {
    const newBuild = new SkillBuild(buildState.name)

    buildState.skillTreeCategoryStates.forEach(stcState => {
      stcState.skillTreeStates.forEach(stState => {
        if (!stState.visible) {
          return
        }
        let skillTree: SkillTree | null = null
        Grimoire.Skill.skillRoot.skillTreeCategorys.some(stc => {
          const find = stc.skillTrees.find(st => st.skillTreeId === stState.origin.skillTreeId)
          if (find) {
            skillTree = find
            return true
          }
          return false
        })
        if (skillTree) {
          newBuild._skillTreesSet.add(skillTree)
        }

        stState.levelSkillTree.levelSkills.forEach(levelSkill => {
          if (levelSkill.level() === 0) {
            return
          }
          let skill: Skill | null = null
          Grimoire.Skill.skillRoot.skillTreeCategorys.some(stc => {
            return stc.skillTrees.some(st => {
              const find = st.skills.find(_skill => _skill.skillId === levelSkill.base.skillId)
              if (find) {
                skill = find
                return true
              }
              return false
            })
          })
          if (skill) {
            const _state = newBuild.getSkillState(skill)
            _state.level = levelSkill.level()
            _state.starGemLevel = levelSkill.starGemLevel()
          }
        })
      })
    })

    return newBuild
  }
}

export type { SkillBuildSaveData }