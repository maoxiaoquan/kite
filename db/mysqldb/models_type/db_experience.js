const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'experience' /* 表名  虚拟币表 */,
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
    associate: {
      // 关联融合字段
      type: Seq.TEXT('long'),
      comment: '关联融合字段',
      field: 'associate'
    },
    value: {
      type: Seq.DECIMAL(8, 2),
      comment: '值',
      field: 'value'
    },
    total: {
      type: Seq.DECIMAL(10, 2),
      comment: '总额',
      field: 'total'
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
      // 动作
      type: Seq.INTEGER(10),
      comment: '动作',
      field: 'action'
    },
    description: {
      // 描述
      type: Seq.TEXT,
      comment: '描述，用处',
      field: 'description'
    },
    ...time.create_date
  }
}
