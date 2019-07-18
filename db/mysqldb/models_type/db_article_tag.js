const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article_tag' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    article_tag_id: {
      // 文章标签
      type: Seq.STRING(20),
      comment: '文章标签',
      defaultValue: shortid.generate,
      field: 'article_tag_id'
    },
    article_tag_name: {
      // 标签名字
      type: Seq.STRING(50),
      comment: '标签名字',
      field: 'article_tag_name'
    },
    article_tag_en_name: {
      // 标签英文名字
      type: Seq.STRING(100),
      comment: '标签英文名字',
      field: 'article_tag_en_name'
    },
    article_tag_icon: {
      // 标签图标地址
      type: Seq.STRING(200),
      comment: '标签图标地址',
      field: 'article_tag_icon'
    },
    article_tag_description: {
      // 标签描述
      type: Seq.STRING(100),
      comment: '标签描述',
      field: 'article_tag_description'
    },
    attention_count: {
      // 关注数统计
      type: Seq.BIGINT(20),
      comment: '关注数统计',
      field: 'attention_count',
      defaultValue: 0
    },
    sort: {
      // 排序
      type: Seq.INTEGER(10),
      comment: '排序',
      field: 'sort'
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    },
    ...time.create_date
  }
}
