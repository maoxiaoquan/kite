const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article' /* 表名 */,
  TABLE: {
    /* 表结构 */
    aid: {
      // 用户ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'aid 主键，自增',
      field: 'aid' //  相应的字段名称
    },
    uid: {
      // 作者id
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    title: {
      // 标题
      type: Seq.TEXT,
      comment: '标题',
      field: 'title'
    },
    excerpt: {
      // 摘记
      type: Seq.TEXT,
      comment: '摘记',
      field: 'excerpt'
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
    source: {
      // 来源 （1原创 2转载）
      type: Seq.INTEGER(10),
      comment: '来源 （1:原创,2转载）',
      field: 'source'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4:免审核；5:已删除)',
      field: 'status'
    },
    type: {
      // 1:文章;2:笔记;3:草稿
      type: Seq.INTEGER(10),
      comment: '类型 （1:文章;2:笔记;3:草稿）',
      field: 'type'
    },
    cover_img: {
      type: Seq.TEXT('long'),
      comment: '封面图片',
      field: 'cover_img'
    },
    read_count: {
      // 阅读数
      type: Seq.BIGINT(20),
      comment: '阅读数',
      field: 'read_count',
      defaultValue: 0
    },
    thumb_count: {
      // 喜欢数
      type: Seq.BIGINT(20),
      comment: '点赞数',
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
    blog_ids: {
      /* 文章所属的用户专栏id 可多个 */
      type: Seq.STRING(180),
      comment: '文章所属的用户专栏id',
      field: 'blog_ids'
    },
    tag_ids: {
      /* 文章所属的标签名字 可多个 */
      type: Seq.TEXT,
      comment: '文章所属的标签id',
      field: 'tag_ids'
    },
    rejection_reason: {
      /* 驳回，或者文章审核不通过的原因 */
      type: Seq.STRING(160),
      comment: '驳回，或者文章审核不通过的原因',
      field: 'rejection_reason'
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date',
      defaultValue: Seq.NOW /* 时间 */
    },
    is_public: {
      // 是否公开
      type: Seq.BOOLEAN,
      comment: '是否公开',
      field: 'is_public',
      defaultValue: () => {
        return true
      }
    },
    update_timestamp: {
      // 更新时间戳
      type: Seq.BIGINT(30),
      comment: '更新时间戳',
      field: 'update_timestamp'
    },
    ...time.create_date
  }
}
