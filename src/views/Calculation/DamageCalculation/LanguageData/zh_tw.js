export default function() {
  return {
    'Damage Calculation': {
      'build': '配置',
      'create build': '新增配置',
      'result': {
        'title': '計算結果',
        'modes': {
          'expected': '傷害期望值',
          'stability': '傷害區間',
          'stability: with graze': 'Graze時傷害區間',
        },
        'modes caption': {
          'expected': '考慮爆擊率及穩定度計算出來的傷害期望值。',
          'stability': '根據穩定度計算出的傷害最大值及最小值。',
          'stability: with graze': '考慮Graze的情況，根據穩定度計算出的傷害最大值及最小值。',
        },
      },
      'calc mode': {
        'title': '介面的計算公式',
        'caption': '這裡可以選擇介面呈現的計算公式。選擇的公式只會影響介面的呈現，不會影響能設定的項目及計算結果。',
        'modes': {
          'common': '基本公式',
          'critical': '爆擊時公式',
        },
        'modes caption': {
          'common': '基本的傷害公式。適用於大部分的計算場合。',
          'critical': '暴擊時的傷害公式，主要用於將「雙手合持」呈現於計算公式中，公式只單純呈現暴擊時的傷害，暴擊率在公式之外。',
        },
      },
      'compare': {
        'title': '配置比較',
        'caption': '這裡可以將目前的配置和其他多個配置進行比較。',
        'select build': '選擇要比較的配置',
        'tips: introduction': '請點擊上方的按鈕來選擇要比較的配置0.0',
        'tips: At least two builds': '要至少有兩個配置才可以使用比較功能0.0',
      },
      'tips': {
        'At least one build must be kept': '要至少保留一個配置0.0',
        'Successfully removed build': '移除配置「$0」成功。',
      },
      'item base: title': {
        'physical': '物理傷害',
        'magic': '魔法傷害',
        'atk': 'ATK',
        'matk': 'MATK',
        'atk_rate': 'ATK比率',
        'matk_rate': 'MATK比率',
        'sub_atk': '副手ATK',
        'sub_stability': '副手倍率',
        'skill_level_two_handed': '((!雙手合持))等級',
        'character_level': '角色等級',
        'target_level': '目標等級',
        'target_def': '目標DEF',
        'target_mdef': '目標MDEF',
        'physical_pierce': '物理貫穿',
        'magic_pierce': '魔法貫穿',
        'skill_constant': '技能常數',
        'unsheathe_attack_constant': '拔刀攻擊',
        'other_constant': '其它常數',
        'skill_multiplier': '技能倍率',
        'critical_damage': '暴擊傷害',
        'critical_rate': '暴擊率',
        'target_critical_rate_resistance': '目標暴擊率抗性',
        'target_critical_rate_resistance_total': '目標總暴擊率抗性',
        'magic_critical_rate_conversion_rate': '法術暴擊率轉化率',
        'magic_critical_damage_conversion_rate': '法術暴擊傷害轉化率',
        'short_range_damage': '近距離威力',
        'long_range_damage': '遠距離威力',
        'unsheathe_attack_multiplier': '拔刀攻擊%',
        'stronger_against_neutral': '對無屬性',
        'stronger_against_fire': '對火屬性',
        'stronger_against_water': '對水屬性',
        'stronger_against_earth': '對地屬性',
        'stronger_against_wind': '對風屬性',
        'stronger_against_light': '對光屬性',
        'stronger_against_dark': '對暗屬性',
        'target_physical_resistance': '物理抗性',
        'target_magic_resistance': '魔法抗性',
        'proration': '慣性加成',
        'stability': '穩定率',
        'probability_of_graze': 'Graze機率',
        'skill_level_long_range': '((!遠程狙擊))等級',
        'combo_multiplier': '連擊倍率',
        'other_multiplier': '其它倍率',
      },
    },
  };
}
