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
      comment: 'id',
      field: 'id'
    },
    uid: {
      // 用户id
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    goods_id: {
      type: Seq.BIGINT(20),
      comment: '产品id',
      field: 'goods_id'
    },
    goods_type: {
      type: Seq.BIGINT(20),
      comment: '产品类型',
      field: 'goods_type'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态',
      field: 'status'
    },
    pay_type: {
      // 支付类型
      type: Seq.INTEGER(10),
      comment: '支付类型',
      field: 'pay_type'
    },
    pay_currency: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '支付货币',
      field: 'pay_currency'
    },
    amount: {
      type: Seq.INTEGER(20),
      comment: '金额',
      field: 'amount'
    },
    type: {
      type: Seq.INTEGER(10),
      comment: '类型',
      field: 'type'
    },
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述',
      field: 'description'
    }
  }
}
