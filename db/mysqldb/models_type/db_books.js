const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
const config = require('../../../server/config')

module.exports = {
  NAME: 'books' /* 表名 */,
  TABLE: {
    /* 表结构 */
    books_id: {
      // 书ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '书ID',
      field: 'books_id'
    },
    uid: {
      // uid
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    title: {
      // 书名字
      type: Seq.STRING(20),
      comment: '书名',
      field: 'title'
    },
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述',
      field: 'description'
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
    read_count: {
      // 书阅读数量
      type: Seq.INTEGER(10),
      comment: '书阅读数量',
      field: 'read_count'
    },
    cover_img: {
      // 书图标
      type: Seq.STRING(220),
      comment: '封面',
      field: 'cover_img',
      defaultValue: () => {
        return config.DF_ICON
      }
    },
    comment_count: {
      // 评论数
      type: Seq.BIGINT(20),
      comment: '评论数',
      field: 'comment_count',
      defaultValue: 0
    },
    tag_ids: {
      /* 小书所属的标签名字 可多个 */
      type: Seq.STRING(180),
      comment: '书所属的标签id',
      field: 'tag_ids'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4：无需审核)',
      field: 'status'
    },
    is_public: {
      // 是否公开
      type: Seq.BOOLEAN,
      comment: '是否公开',
      field: 'is_public',
      defaultValue: () => {
        return false
      }
    },
    rejection_reason: {
      /* 驳回，或者小书审核不通过的原因 */
      type: Seq.STRING(160),
      comment: '驳回，或者小书审核不通过的原因',
      field: 'rejection_reason'
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date',
      defaultValue: Seq.NOW /* 时间 */
    },
    ...time.create_date
  }
}
