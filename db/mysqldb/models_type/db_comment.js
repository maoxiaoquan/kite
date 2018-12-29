const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'comment' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      //评论 ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    parent_id: {
      //评论 父ID
      type: Seq.INTEGER(10),
      comment: 'parent_id',
      field: 'parent_id'
    },
    aid: {
      // 文章id
      type: Seq.STRING(20),
      comment: '文章id',
      field: 'aid'
    },
    uid: {
      // 评论用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    reply_uid: {
      // 回复评论用户ID
      type: Seq.INTEGER(10),
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
      comment: '状态(1:未审核;2:审核通过;3:回收站)',
      field: 'status'
    },
    ...time.create_date
  }
}
