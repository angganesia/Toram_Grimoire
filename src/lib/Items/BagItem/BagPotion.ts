import { markRaw } from 'vue'

import { BagItem } from '.'

class BagPotionsRoot {
  readonly categorys: BagPotionsCategory[]
  readonly allPotions: BagPotion[]

  constructor() {
    this.categorys = markRaw([])
    this.allPotions = markRaw([])
  }

  appendCategory(id: string, name: string): BagPotionsCategory {
    const category = new BagPotionsCategory(this, id, name)
    this.categorys.push(category)
    return category
  }
}

class BagPotionsCategory {
  readonly root: BagPotionsRoot
  readonly id: string
  readonly name: string

  readonly obtainCategorys: BagPotionsObtainCategory[]

  constructor(parent: BagPotionsRoot, id: string, name: string) {
    this.root = parent
    this.id = id
    this.name = name
    this.obtainCategorys = markRaw([])
  }

  appendObtainCategory(id: string, name: string): BagPotionsObtainCategory {
    const obtainCategory = new BagPotionsObtainCategory(
      this,
      `${this.id}-${id}`,
      name
    )
    this.obtainCategorys.push(obtainCategory)
    return obtainCategory
  }
}

class BagPotionsObtainCategory {
  private readonly _parent: BagPotionsCategory
  readonly id: string
  readonly name: string
  readonly potions: BagPotion[]

  constructor(parent: BagPotionsCategory, id: string, name: string) {
    this._parent = parent
    this.id = id
    this.name = name
    this.potions = markRaw([])
  }

  appendPotion(name: string): BagPotion {
    const potion = new BagPotion(`${this.id}-${this.potions.length}`, name)
    this._parent.root.allPotions.push(potion)
    return potion
  }
}

class BagPotion extends BagItem {
  healType: 'hp' | 'mp' | null

  constructor(id: string, name: string) {
    super(id, name)
    this.healType = null
  }
}

export { BagPotionsRoot }
export type { BagPotionsCategory, BagPotionsObtainCategory, BagPotion }
