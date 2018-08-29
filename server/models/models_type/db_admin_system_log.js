const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'admin_system_log', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 后台操作日志表
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'id',
      field: 'id'
    }
  }
}