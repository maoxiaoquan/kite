const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'virtual' /* 表名  虚拟币表 */,
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
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述，用处',
      field: 'description'
    },
    amount: {
      type: Seq.INTEGER(20),
      comment: '金额',
      field: 'amount'
    },
    balance: {
      type: Seq.BIGINT(20),
      comment: '余额',
      field: 'balance'
    },
    is_increase: {
      type: Seq.INTEGER(10),
      comment: '是否增加',
      field: 'is_increase'
    },
    status: {
      // 状态
      type: Seq.INTEGER(10),
      comment: '状态',
      field: 'status'
    },
    type: {
      type: Seq.INTEGER(10),
      comment: '类型',
      field: 'type'
    }
  }
}
