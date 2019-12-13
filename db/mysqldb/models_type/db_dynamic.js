const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'dynamic' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 用户ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id' //  相应的字段名称
    },
    uid: {
      // 作者id
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    content: {
      // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'content'
    },
    origin_content: {
      // 原内容
      type: Seq.TEXT('long'),
      comment: '原内容',
      field: 'origin_content'
    },
    attach: {
      type: Seq.TEXT('long'),
      comment: '附加内容',
      field: 'attach'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4：无需审核)',
      field: 'status'
    },
    type: {
      // 类型1:动态;2:提问
      type: Seq.INTEGER(10),
      comment: '类型 （1:默认动态;2:图片,3:链接，4：视频 ）',
      field: 'type'
    },
    thumb_count: {
      // 喜欢数
      type: Seq.BIGINT(20),
      comment: '喜欢数',
      field: 'thumb_count',
      defaultValue: 0
    },
    comment_count: {
      // 评论数
      type: Seq.BIGINT(20),
      comment: '评论数',
      field: 'comment_count',
      defaultValue: 0
    },
    topic_ids: {
      /* 所属的话题名字 可多个 */
      type: Seq.STRING(200),
      comment: '文章所属的标签id',
      field: 'topic_ids'
    },
    topic_name: {
      /* 以后可能用到的话题名字 */
      type: Seq.STRING(200),
      comment: '以后可能用到的话题名字',
      field: 'topic_name'
    },
    rejection_reason: {
      /* 文章所属的标签名字 可多个 */
      type: Seq.STRING(160),
      comment: '驳回，或者审核不通过的原因',
      field: 'rejection_reason'
    },
    ...time.create_date
  }
}
