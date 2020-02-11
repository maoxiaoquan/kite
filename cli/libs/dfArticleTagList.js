const config = require('../../config')
module.exports = [
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    name: '其他',
    en_name: 'other',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '默认的文章标签',
    attention_count: 0,
    enable: true,
    is_push: true
  },
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    tag_id: config.ARTICLE_TAG.dfOfficialExclusive,
    name: '官方专属',
    en_name: 'official',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '官方标签发布文章专属标签',
    attention_count: 0,
    enable: true,
    is_push: true
  }
]
