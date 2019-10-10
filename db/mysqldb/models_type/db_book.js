const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'book' /* 表名 */,
  TABLE: {
    /* 表结构 */
    book_id: {
      // 书的章节id
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '书的章节id 主键，自增',
      field: 'book_id' //  相应的字段名称
    },
    books_id: {
      // 书的id
      type: Seq.BIGINT(20),
      comment: '书的id 主键，自增',
      field: 'books_id' //  相应的字段名称
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
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态(1:审核中;2:审核通过;3:审核失败;4:已删除;5:无需审核)',
      field: 'status'
    },
    rejection_reason: {
      /* 驳回，或者文章审核不通过的原因 */
      type: Seq.STRING(160),
      comment: '驳回，或者文章审核不通过的原因',
      field: 'rejection_reason'
    },
    sort: {
      // 排序
      type: Seq.INTEGER(10),
      comment: '排序',
      field: 'sort'
    },
    read_count: {
      // 书章节阅读数量
      type: Seq.INTEGER(10),
      comment: '书章节阅读数量',
      field: 'read_count'
    },
    read_time: {
      // 阅读时间
      type: Seq.INTEGER(10),
      comment: '阅读时间',
      field: 'read_time'
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date',
      defaultValue: Seq.NOW /* 时间 */
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
