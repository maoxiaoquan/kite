const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'attention_user' /* 表名 */,
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
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    attention_uid: {
      // 关注的用户ID
      type: Seq.BIGINT(20),
      comment: 'attention_uid',
      field: 'attention_uid'
    },
    is_attention: {
      // 是否like
      type: Seq.BOOLEAN,
      comment: '是否关注',
      field: 'is_attention'
    },
    ...time.create_date
  }
}
