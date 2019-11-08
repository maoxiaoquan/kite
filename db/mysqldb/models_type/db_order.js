const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'order' /* 表名 我的订单 */,
  TABLE: {
    /* 表结构 */
    id: {
      // id
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id',
      field: 'id'
    },
    uid: {
      // 用户id
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    product_id: {
      type: Seq.BIGINT(20),
      comment: '产品id',
      field: 'product_id'
    },
    product_type: {
      type: Seq.BIGINT(20),
      comment: '产品类型',
      field: 'product_type'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态',
      field: 'status'
    },
    pay_type: {
      // 支付类型
      type: Seq.INTEGER(6),
      comment: '支付类型',
      field: 'pay_type'
    },
    amount: {
      type: Seq.DECIMAL(8, 2),
      comment: '金额',
      field: 'amount'
    },
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述',
      field: 'description'
    },
    ...time.create_date
  }
}
