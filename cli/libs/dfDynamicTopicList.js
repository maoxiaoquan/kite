const config = require('../../config')
module.exports = [
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    name: '其他',
    en_name: 'other',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '默认的动态话题',
    sort: 0,
    is_show: true,
    enable: true,
    is_push: true
  },
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    topic_id: config.DYNAMIC.dfOfficialTopic,
    name: '官方专属',
    en_name: 'official',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '官方动态话题',
    sort: 1,
    is_show: true,
    enable: true,
    is_push: true
  },
  {
    // 初始化文章标签，并且只有一个超管的角色，否则会报错
    topic_id: config.DYNAMIC.dfTreeHole,
    name: '树洞',
    en_name: 'tree-hole',
    icon: config.DF_ARTICLE_TAG_IMG,
    description: '树洞',
    sort: 2,
    is_show: true,
    enable: true,
    is_push: true
  }
]
