const config = require('../config')
module.exports = [
  {
    // 初始化专栏，并且只有一个超管的角色，否则会报错
    name: '默认',
    en_name: 'default',
    icon: config.DF_ARTICLE_TAG_IMG,
    tag_ids: '',
    description: '推荐一些热门的文章',
    sort: 0,
    is_home: true,
    enable: true
  }
]
