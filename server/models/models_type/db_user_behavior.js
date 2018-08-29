const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_behavior', /*表名*/
  TABLE: {
    /*表结构*/
    uid: { // 用户ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'uid',
      field: 'uid'
    },
    keyword: { // 关键字
      type: Seq.STRING(20),
      comment: 'keyword',
      field: 'keyword'
    },
    type: { // 类型
      type: Seq.STRING(20),
      comment: 'type',
      field: 'type'
    },
    create_date: { // 创建时间
      type: Seq.DATEONLY,
      comment: '创建时间',
      field: 'create_date'
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp'
    }
  }
}