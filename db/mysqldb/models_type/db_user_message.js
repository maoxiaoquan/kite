const Seq = require('sequelize')
const time = require('../time')
module.exports = {
  NAME: 'user_message' /* 表名 */,
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
    type: {
      // 类型  1:系统 2:喜欢文章  3:关注标签 4:关注用户 5:评论
      type: Seq.INTEGER(10),
      comment: '1:系统消息 2:喜欢文章 3:关注标签 4:用户关注 5:评论',
      field: 'type'
    },
    content: {
      // 消息的内容
      type: Seq.TEXT('long'),
      comment: '消息的内容',
      field: 'content'
    },
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    },
    ...time.create_date
  }
}
