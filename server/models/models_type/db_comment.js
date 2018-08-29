const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'comments', /*表名*/
  TABLE: {
    /*表结构*/
    comment_id: { //评论 ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    comment_parent_id: { //评论 父ID
      type: Seq.INTEGER(10),
      comment: 'id',
      field: 'id'
    },
    aid: { // 文章id
      type: Seq.STRING(20),
      comment: '文章id',
      field: 'aid'
    },
    uid: { // 评论用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    nickname: { // 评论用户nickname
      type: Seq.STRING(20),
      comment: 'uid',
      field: 'uid'
    },
    avatar: { // 头像
      type: Seq.STRING(100),
      comment: '头像',
      field: 'avatar'
    },
    content: { // 评论内容
      type: Seq.TEXT,
      comment: '评论内容',
      field: 'content'
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
    },
    status: { // 状态
      type: Seq.INTEGER(5),
      comment: '状态(1:审核中;2:审核通过;3:回收站)',
      field: 'status'
    }
  }
}