const config = require('../../config')
module.exports = [
  {
    // 初始化专栏，并且只有一个超管的角色，否则会报错
    name: '全站',
    en_name: 'all',
    icon: config.DF_ARTICLE_TAG_IMG,
    tag_ids: '',
    description: '所有的专栏',
    sort: 0,
    is_home: true,
    enable: true
  }
]
