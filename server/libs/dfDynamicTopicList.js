const config = require('../config')
module.exports = [
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    name: '其他',
    en_name: 'other',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '默认的文章标签',
    sort: 0,
    is_show: true,
    enable: true
  },
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    topic_id: config.DYNAMIC.officialTopic,
    name: '官方专属',
    en_name: 'official',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '官方动态话题',
    sort: 1,
    is_show: true,
    enable: true
  }
]
