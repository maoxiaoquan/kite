const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'chat_message' /* 表名 */,
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
    chat_id: {
      // 关系ID
      type: Seq.STRING(180),
      comment: 'chat_id 聊天关系id',
      field: 'chat_id'
    },
    send_uid: {
      // 用户ID
      type: Seq.INTEGER(10),
      comment: 'send_uid',
      field: 'send_uid'
    },
    receive_uid: {
      // 用户ID
      type: Seq.INTEGER(10),
      comment: 'receive_uid',
      field: 'receive_uid'
    },
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    },
    content: {
      // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'content'
    },
    ...time.create_date
  }
}
