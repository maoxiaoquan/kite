const Seq = require('sequelize')
const time = require('../time')

module.exports = {
  NAME: 'options' /* 表名 */,
  TABLE: {
    /* 表结构 */
    option_id: {
      // options ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'option_id',
      field: 'option_id'
    },
    option_key: {
      // options name
      type: Seq.STRING(180),
      comment: '键',
      field: 'option_key'
    },
    option_value: {
      // options value
      type: Seq.TEXT('long'),
      comment: '值',
      field: 'option_value'
    },
    ...time.create_date
  }
}
