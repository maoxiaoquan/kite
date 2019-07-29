const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article_blog' /* 表名 */,
  TABLE: {
    /* 表结构 */
    blog_id: {
      // 专题ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '专题ID',
      field: 'blog_id'
    },
    uid: {
      // uid
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    name: {
      // 专题名字
      type: Seq.STRING(20),
      comment: '名字',
      field: 'name'
    },
    description: {
      // 专题描述
      type: Seq.STRING(100),
      comment: '描述',
      field: 'description'
    },
    subscribe: {
      // 专题订阅数量
      type: Seq.INTEGER(10),
      comment: '订阅数量（预留）',
      field: 'subscribe'
    },
    icon: {
      // 专题图标
      type: Seq.STRING(200),
      comment: '图标（预留）',
      field: 'icon'
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示（预留）',
      field: 'enable'
    },
    ...time.create_date
  }
}
