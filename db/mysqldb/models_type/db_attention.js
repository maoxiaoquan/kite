const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'attention' /* 表名 */,
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
    associate_id: {
      // 关联的内容
      type: Seq.STRING(50),
      comment: '关联的内容',
      field: 'associate_id'
    },
    type: {
      // 类型
      type: Seq.INTEGER(6),
      comment: '类型',
      field: 'type'
    },
    is_associate: {
      // 是否like
      type: Seq.BOOLEAN,
      comment: '是否关联',
      field: 'is_associate'
    },
    ...time.create_date
  }
}
