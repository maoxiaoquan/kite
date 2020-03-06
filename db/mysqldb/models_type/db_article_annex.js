const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
const config = require('../../../config')

module.exports = {
  NAME: 'article_annex' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    aid: {
      // 文章ID
      type: Seq.BIGINT(20),
      comment: '文章',
      field: 'aid'
    },
    uid: {
      // uid
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    attachment: {
      // 内容
      type: Seq.TEXT('long'),
      comment: '内容',
      field: 'attachment'
    },
    origin_attachment: {
      // 原内容
      type: Seq.TEXT('long'),
      comment: '原内容',
      field: 'origin_attachment'
    },
    is_free: {
      // 是否免费
      type: Seq.INTEGER(6),
      comment: '是否免费',
      field: 'is_free'
    },
    pay_type: {
      // 支付类型
      type: Seq.INTEGER(6),
      comment: '支付类型',
      field: 'pay_type'
    },
    price: {
      type: Seq.DECIMAL(6, 2),
      comment: '价格',
      field: 'price'
    },
    ...time.create_date
  }
}
