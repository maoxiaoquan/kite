const config = require('../config')
module.exports = [
  {
    // 初始化专栏，并且只有一个超管的角色，否则会报错
    article_column_name: '推荐',
    article_column_en_name: 'suggest',
    article_column_icon: config.DF_ARTICLE_TAG_IMG,
    article_tag_ids: '',
    article_column_description: '推荐一些热门的文章',
    sort: 0,
    is_home: true,
    enable: true
  }
]
