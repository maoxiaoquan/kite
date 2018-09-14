const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../../utils/time')

module.exports = {
  NAME: 'user_attention', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
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
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
  }
}