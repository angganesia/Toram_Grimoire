export default function(){
  return {
    'Enchant Simulator': {
      'build': '配置',
      'base options': '基本设定',
      'advanced options': '进阶设定',
      'common options': '共通设定',
      'equipment type': '装备类型',
      'append build': '新增配置',
      'equipment types': {
        'main-weapon': '主手武器',
        'body-armor': '身体防具',
        'main-weapon|original-element': '主手武器｜原有属性'
      },
      'enchant step': '步骤',
      'step type - each: title': '分次附、每次附',
      'last step': '最终步骤',
      'invalid step': '无效步骤',
      'success rate': '成功率',
      'success rate: unlimited': '无限',
      'equipment original potential': '装备初始潜力值',
      'equipment base potential': '制作装备基础潜力值',
      'character level': '角色等级',
      'smith level': '基础锻造熟练度',
      'material point type list': ['金属', '兽品', '木材', '布料', '药品', '魔素'],
      'step': {
        'insert step before': '向前插入步骤',
        'up swap': '上移一格',
        'down swap': '下移一格',
        'auto fill positive stat': '正属全上',
        'select one stat item': '选择单项能力',
        'select multiple stat items': '选择多项能力',
        'type: each': '分次附模式'
      },
      'select item': {
        'title: normal': '选择多项能力',
        'title: once': '选择单项能力'
      },
      'result': {
        'enchant: normal': '附',
        'enchant: each': '分次附、每次附$0、直到$1',
        'stats': '最终结果',
        'materials': '素材耗量',
        'show detail': '显示详细资讯',
      },
      'stat display mode': {
        'title': '切换能力项目的资讯',
        'potential cost': '潜力消耗',
        'material point': '素材消耗'
      },
      'tips': {
        'step stat repeated': '这个步骤已经有这个能力了0.0',
        'step is empty': '这个步骤还空空的...',
        'number of stats of equipment has reached the upper limit': '这件装备的能力数量已达上限。',
        'keep at least one build': '请至少保留一个配置0.0',
        'invalid enchant result': '目前的配置还没办法产生结果唷0.0',
        'confirm: remove build': '确定要移除这个配置吗0.0？',
        'copy build successfully': '复制配置成功。',
        'copy result text successfully': '复制结果成功。'
      },
      'save': {
        'tips': {
          'auto save successfully': '自动存档成功。',
          'auto load successfully': '自动读取成功。',
          'export successfully': '汇出成功。',
          'import successfully': '汇入$0成功。',
          'import: error': '汇入时发生错误。',
          'import: wrong file type': '汇入的档案必须为.txt档。'
        }
      }
    }
  };
}