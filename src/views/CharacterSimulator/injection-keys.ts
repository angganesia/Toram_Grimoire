import { InjectionKey } from 'vue'

import { CharacterEquipment } from '@/lib/Character/CharacterEquipment'
import { EquipmentField } from '@/lib/Character/Character'
import { CharacterComboSkill } from '@/lib/Character/CharacterCombo'

interface CharacterSimulatorInjection {
  editCrystal: (equipment: CharacterEquipment) => void;
  editBasic: (equipment: CharacterEquipment) => void;
  editStat: (equipment: CharacterEquipment) => void;
  editEquipmentFieldEquipment: (field: EquipmentField) => void;
  appendEquipments: () => void;
  createCustomEquipment: () => void;
  selectComboSkill: (comboSkill: CharacterComboSkill) => void;
}

export const CharacterSimulatorInjectionKey: InjectionKey<CharacterSimulatorInjection> = Symbol('character-simulator')
