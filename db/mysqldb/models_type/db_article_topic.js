const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article_topic' /* 表名 */,
  TABLE: {
    /* 表结构 */
    topic_id: {
      // 专题ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '专题ID',
      field: 'topic_id'
    },
    uid: {
      // uid
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    topic_name: {
      // 专题名字
      type: Seq.STRING(20),
      comment: '专题名字',
      field: 'topic_name'
    },
    topic_description: {
      // 专题描述
      type: Seq.STRING(100),
      comment: '专题描述',
      field: 'topic_description'
    },
    topic_subscribe: {
      // 专题订阅数量
      type: Seq.INTEGER(10),
      comment: '专题订阅数量（预留）',
      field: 'topic_subscribe'
    },
    topic_icon: {
      // 专题图标
      type: Seq.STRING(200),
      comment: '专题图标（预留）',
      field: 'topic_icon'
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
