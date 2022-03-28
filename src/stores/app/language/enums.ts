export const enum LocaleGlobalNamespaces {
  App = 'app',
  Common = 'common',
  Global = 'global',
}

export const enum LocaleViewNamespaces {
  SkillQuery = 'skill-query',
  DamageCalculation = 'damage-calculation',
  SkillSimulator = 'skill-simulator',
  CharacterSimulator = 'character-simulator',
  EnchantSimulator = 'enchant-simulator',
  EnchantDoll = 'enchant-doll',
  CrystalQuery = 'crystal-query',
}

export type LocaleNamespaces = LocaleGlobalNamespaces | LocaleViewNamespaces
