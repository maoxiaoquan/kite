const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../../utils/time')
module.exports = {
  NAME: 'admin_system_log', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 后台操作日志表
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'id',
      field: 'id'
    },
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    }
  }
}