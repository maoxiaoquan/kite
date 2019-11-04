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
    ass_uid: {
      // 关联用户
      type: Seq.BIGINT(20),
      comment: '关联用户',
      field: 'ass_uid'
    },
    associate: {
      // 关联融合字段
      type: Seq.TEXT('long'),
      comment: '关联融合字段',
      field: 'associate'
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
    plus_less: {
      type: Seq.INTEGER(10),
      comment: '加减',
      field: 'plus_less'
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
    },
    action: {
      // 消息动作
      type: Seq.INTEGER(10),
      comment: '消息动作',
      field: 'action'
    },
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述，用处',
      field: 'description'
    }
  }
}
