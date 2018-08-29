const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_attention', /*表名*/
  TABLE: {
    /*表结构*/
    connection_id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'connection_id 主键，自增',
      field: 'connection_id'
    },
    uid: { // 用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field:'uid'
    },
    attention_uid: { // 关注的用户ID
      type: Seq.INTEGER(10),
      comment: 'attention_uid',
      field:'attention_uid'
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