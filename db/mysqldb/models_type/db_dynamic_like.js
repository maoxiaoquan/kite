const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'dynamic_like' /* 表名 */,
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
    dynamic_id: {
      // 动态的dynamic_id
      type: Seq.BIGINT(20),
      comment: '动态的dynamic_id',
      field: 'dynamic_id'
    },
    ...time.create_date
  }
}
