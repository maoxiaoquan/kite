const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'user_behavior' /*表名*/,
  TABLE: {
    /*表结构*/
    uid: {
      // 用户ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'uid',
      field: 'uid'
    },
    keyword: {
      // 关键字
      type: Seq.STRING(20),
      comment: 'keyword',
      field: 'keyword'
    },
    type: {
      // 类型
      type: Seq.STRING(20),
      comment: 'type',
      field: 'type'
    },
    ...time.create_date
  }
}
