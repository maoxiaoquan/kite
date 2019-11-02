const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'book_comment' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 评论 ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    parent_id: {
      // 评论 父ID
      type: Seq.BIGINT(20),
      comment: 'parent_id',
      field: 'parent_id'
    },
    reply_id: {
      // 评回复评论id
      type: Seq.BIGINT(20),
      comment: '回复评论id,和parent_id类似',
      field: 'reply_id'
    },
    books_id: {
      // 书的id
      type: Seq.BIGINT(20),
      comment: '书的id',
      field: 'books_id'
    },
    book_id: {
      // 书的章节的id
      type: Seq.BIGINT(20),
      comment: '书的章节的id',
      field: 'book_id'
    },
    uid: {
      // 评论用户ID
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    reply_uid: {
      // 回复评论用户ID
      type: Seq.BIGINT(20),
      comment: 'reply_uid',
      field: 'reply_uid'
    },
    content: {
      // 评论内容
      type: Seq.TEXT,
      comment: '评论内容',
      field: 'content'
    },
    status: {
      // 状态
      type: Seq.INTEGER(5),
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4:无需审核)',
      field: 'status'
    },
    ...time.create_date
  }
}
