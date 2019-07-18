const config = require('../config')
module.exports = [
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    article_tag_name: '其他',
    article_tag_en_name: 'other',
    article_tag_icon: config.default_article_tag,
    article_tag_description: '默认的文章标签',
    attention_count: 0,
    enable: true
  },
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    article_tag_id: config.ARTICLE_TAG.official_exclusive,
    article_tag_name: '官方专属',
    article_tag_en_name: 'official',
    article_tag_icon: config.default_article_tag,
    article_tag_description: '官方标签发布文章专属标签',
    attention_count: 0,
    enable: true
  }
]
