const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'dynamic_comment' /* 表名 */,
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
    dynamic_id: {
      // 文章id
      type: Seq.BIGINT(20),
      comment: '文章id',
      field: 'aid'
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
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4:回收站，5:无需审核)',
      field: 'status'
    },
    ...time.create_date
  }
}
