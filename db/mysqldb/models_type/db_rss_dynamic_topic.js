const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'rss_dynamic_topic' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 关系ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    uid: {
      // 用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    topic_id: {
      // 话题ID
      type: Seq.STRING(20),
      comment: 'id 主键，自增',
      field: 'topic_id'
    }
  }
}
