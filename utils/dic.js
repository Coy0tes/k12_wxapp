const dic = {
  spirit: {
    name: '精神',
    WELL: '良好',
    DOLDRUMS: '精神不振',
    SAG: '萎靡',
    TOOEXCITED: '太过兴奋',
    TOOAGITATED: '过于烦躁'
  },
  body: {
    name: '身体',
    WELL: '正常',
    COUGH: '咳嗽',
    RHINORRHEA: '流鼻涕',
    FEVERHIGH: '高烧',
    EVERLOWF: '低烧',
    DIARRHEA: '腹泻'
  },
  sink: {
    name: '皮肤',
    WELL: '正常',
    RASH: '皮疹',
    ALLERGY: '过敏',
    BODYHURT: '身体外伤',
    FACEHURT: '脸部外伤',
    MOSQUITOHURT: '蚊虫叮咬'
  },
  dinner: {
    name: '正餐',
    WELL: '正常',
    LESSEATTING: '饭吃的较少',
    LESSVEGETABLE: '蔬菜吃的少',
    LESSMEAT: '肉类吃的少',
    TEACHERHELP: '需要老师喂'
  },
  afternap: {
    name: '午睡',
    WELL: '正常',
    LESS: '少于30分钟',
    NOSELEEP: '没睡'
  },
  addfood: {
    name: '加餐',
    WELL: ' 正常',
    LESSDRINK: '饮品喝的少',
    LESSFRUIT: '水果吃的少',
    LESSMEAT: '肉类吃的少',
    MEDICINE: '药已吃'
  },
  excrete: {
    name: '大小便',
    WELL: '正常',
    YELLO: '小便黄',
    LESS: '小便少',
    CONSTIPATION: '便秘',
    DIARRHEA: '拉稀'
  },
  mouth: {
    name: '口腔',
    WELL: '正常',
    HERPAS: '疱疹',
    ULCERATION: '溃疡',
    THROATRED: '咽部发红'
  },
  other: {
    name: '其他',
    MEDICINE: '携带药物',
    DANGEROUS: '携带危险物品',
    NOTHING: '无'
  }
}

let reset = (data) => {
  let arr = []
  for (var i in data){
    let obj = {}
    if (i == 'Temperature') {
      // obj.name = '体温'
      // obj.value = data[i]
      continue
    } else {
      obj.name = dic[i].name
      dic[i][data[i]] == undefined ? obj.value = '' : obj.value = dic[i][data[i]]
    }
    arr.push(obj)
  }
  return arr
}

module.exports = reset