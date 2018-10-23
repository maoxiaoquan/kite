const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'user_message' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      // 关系ID
      type: Seq.INTEGER(10),
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
    type: {
      // 类型 1 喜欢文章  2 关注标签 3 关注用户 4 评论回复 5 文章有新的评论
      type: Seq.INTEGER(10),
      comment: 'type',
      field: 'type'
    },
    title: {
      // 标题
      type: Seq.TEXT,
      comment: '标题',
      field: 'title'
    },
    content: {
      // 内容
      type: Seq.TEXT,
      comment: '内容',
      field: 'content'
    },
    aid: {
      // 文章id
      type: Seq.STRING(20),
      comment: '文章id',
      field: 'aid'
    },
    other_uid: {
      // 其他用户ID
      type: Seq.INTEGER(10),
      comment: 'other_uid',
      field: 'other_uid'
    },
    comment_id: {
      //评论 ID
      type: Seq.INTEGER(10),
      comment: 'comment_id',
      field: 'comment_id'
    },
    create_date: {
      // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: {
      // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
    is_system: {
      // 是否为系统消息
      type: Seq.BOOLEAN,
      comment: '是否为系统消息',
      field: 'is_system',
      defaultValue: false
    },
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    }
  }
}
