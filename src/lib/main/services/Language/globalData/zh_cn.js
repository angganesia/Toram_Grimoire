export default function() {
  return {
    'global': {
      'second': '秒',
      'confirm': '确定',
      'cancel': '取消',
      'clear': '清除',
      'split string': '、',
      'menu': '选单',
      'delete': '删除',
      'remove': '移除',
      'copy': '复制',
      'download': '下载',
      'search': '查询',
      'recovery': '复原',
      'button': '按钮',
      'none': '无',
      'create': '建立',
      'close': '关闭',
      'export': '汇出',
      'import': '汇入',
      'reset': '重置',
      'copy to clipboard finished': '已复制文本至剪贴簿。',
      'LocalStorage is inavailable': '此浏览器版本无法使用内建储存功能。',
    },
    'common': {
      'Equipment': {
        'field': {
          'main-weapon': '主手武器',
          'sub-weapon': '副手武器',
          'sub-armor': '副手防具',
          'body-armor': '身体装备',
          'additional': '追加装备',
          'special': '特殊装备',
          'avatar': '时装'
        },
        'category': {
          'one-hand-sword': '单手剑',
          'two-hand-sword': '双手剑',
          'bow': '弓',
          'bowgun': '弩',
          'staff': '杖',
          'magic-device': '魔导具',
          'knuckle': '拳套',
          'halberd': '旋风枪',
          'katana': '拔刀剑',
          'sub-weapon|arrow': '箭矢',
          'sub-weapon|dagger': '小刀',
          'sub-weapon|ninjutsu-scroll': '忍术卷轴',
          'sub-armor|shield': '盾牌',
          'body-armor|normal': '一般防具',
          'body-armor|dodge': '轻化防具',
          'body-armor|defense': '重化防具'
        },
        'stat restriction': {
          'event': '活动',
          'one-hand-sword': '单手剑',
          'two-hand-sword': '双手剑',
          'dual-sword': '双剑',
          'bow': '弓',
          'bowgun': '弩',
          'staff': '法杖',
          'magic-device': '魔导具',
          'knuckle': '拳套',
          'halberd': '旋风枪',
          'katana': '拔刀剑',
          'sub': {
            'arrow': '箭矢',
            'shield': '盾牌',
            'dagger': '小刀',
            'katana': '副手拔刀剑',
            'magic-device': '副手魔导具',
            'knuckle': '副手拳套',
            'one-hand-sword': '双剑',
            'ninjutsu-scroll': '忍术卷轴'
          },
          'body': {
            'dodge': '轻化防具',
            'defense': '重化防具',
            'normal': '一般防具'
          }
        },
        'obtain': {
          'mobs': '小怪',
          'boss': '定点BOSS',
          'mini_boss': '地图BOSS',
          'quest': '任务',
          'smith': '铁匠铺',
          'create equipment': '制作装备',
          'all smith': '各个城镇的铁匠铺',
          'no data': '尚无资料',
          'unknow': '未知',
          'other': '其它',
          'box': '箱子道具',
          'exchange': '交换所',
          'ex_skill': 'EX技能'
        },
      }
    },
    'Loading Page': {
      'bottom tips': '初次载入需要较长的时间，请稍后...<br />若载入途中发生错误，请先试着重新整理网页。'
    },
    'Loading Message': {
      'Stats': '载入角色能力清单',
      'CharacterStats': '载入角色模拟器资料',
      'Items': '载入装备资料',
      'Skill': '载入技能资料',
      'Tag': '载入标签清单',
      'Enchant': '载入附魔资料',
      'init': '初始化'
    },
    'Page Title': {
      'base': '布偶的魔法书',
      'character-simulator': '角色模拟',
      'skill-simulator': '技能模拟',
      'skill-query': '技能查询',
      'item-query': '道具查询',
      'crystal-query': '锻晶查询',
      'calculation': {
        'damage': '伤害计算'
      },
      'enchant': {
        'enchant-simulator': '附魔模拟',
        'enchant-doll': '附魔布偶'
      }
    },
    'Left Menu': {
      'Home': {
        'base': '主页',
        'about': '关于'
      }
    },
    'Footer': {
      'night mode': '夜间模式'
    },
    'Settings': {
      'title': '设定',
      'update': {
        'new version detected': '侦测到新版本',
        'force update': '立即更新',
        'tips: new version detected': '侦测到新版本，可到设定里进行手动更新。',
      },
      'switch font': {
        'title': '更改字体',
        'caption': '若字体显示有问题（特定装置会发生），或是不喜欢现在的预设字体，可以切换字体为基本字体。',
        'warn 1': '切换后可能要花费数秒的时间下载字体，才能完成替换。',
        'default font': '预设字体',
        'base font': '基本字体'
      },
      'language': {
        'title': '语言设定',
        'caption': '可选择页面显示的语言，一般情况下不必特别设定。',
        'warn 1': '设定完毕后，页面需重新整理方得生效。',
        'warn 2': '尚未翻译的部分依然会显示其他语言。',
        'button texts': {
          'lang auto': '自动判定',
          'lang 0': 'English',
          'lang 1': '繁体中文',
          'lang 2': '日本语',
          'lang 3': '简体中文'
        }
      },
      'second language': {
        'title': '次要语言设定',
        'caption': '可设定第二优先级的语言。简单来说，若选择的语言还没有翻译，便会优先显示这边设定的语言。',
        'warn 1': '设定完毕后，页面需重新整理方得生效。',
        'warn 2': '若第二优先级语言依然没有翻译，则会显示原始资料（一般而言是繁体中文）。',
      },
      'clear caches of spreadsheets': {
        'title': '清除资料库快取',
        'caption': '魔法书页面的载入时间，大约有99%都是用于下载资料库。为了改善使用者体验，魔法书使用了快取技术，让使用者只要下载一次资料库，之后进入相同的页面时可以不用重新下载，达到几乎零读取时间，并在背景将快取更新到最新。然而有时候资料库的资料更新后，页面却还是一直使用快取（旧的资料库资料），而可能导致程式无法正确运作。因此下方的按钮提供删除资料库快取的功能，下次进入页面时资料库将会重新下载，如此一来可以确保资料库是最新的。',
        'warn 1': '一般情况下，也不用特别使用这个功能。当较旧的资料库资料会导致程式无法正常运作时，才必须使用此功能。。',
        'warn 2': '快取被清除后，下次进入页面时资料库需要重新下载。这可能需要数十秒的时间，请耐心等待。',
        'warn 3': '清除快取完毕后，可以使用重新整理，让页面立即重新载入。',
        'button texts': {
          'clear caches of spreadsheets': '清除资料库快取'
        },
        'Clear caches of spreadsheet successfully': '已清除资料库快取。下次进入页面时将会重新下载资料库。'
      },
      'storage backup': {
        'title': '存档备份',
        'caption': '由于魔法书的存档功能皆是利用浏览器本身的功能，将资料储存在装置上，因此可能因为清除浏览资料或更换装置等因素，导致存档遗失。透过下方的按钮可以将整个魔法书的存档资料储存成一个档案，并在需要读取资料时，透过下方的按钮进行读取。亦可以读取他人提供的档案，也可以跨浏览器进行资料的储存与读取。',
        'warn 1': '进行读取后，原本的资料将会被覆盖。',
        'warn 2': '读取成功后，请直接重新整理网页，可以确保系统正确初始化。',
        'button texts': {
          'save': '存档资料备份',
          'load': '读取存档资料'
        },
        'Save successfully': '存档成功。',
        'Load successfully': '读取成功。',
        'Load failed': '读取失败。',
        'Wrong type of file': '读取的档案必须为文字（.txt）档。',
        'Must be operated on the homepage': '为避免发生无法预期的错误，此功能限制只能在首页使用。'
      }
    },
    'stat base': {
      'type total: preText': '总'
    }
  };
}