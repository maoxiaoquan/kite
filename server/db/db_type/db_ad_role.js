const Seq = require('sequelize')

module.exports = {
  NAME: 'ad_role', /*表名*/
  TABLE: {
    /*表结构*/
    roleid: { // 角色ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '角色ID 主键，自增',
      field: 'roleid '
    },
    role_name: { // 角色名字
      type: Seq.CHAR(16),
      comment: '账户',
      field: 'role_name'
    }
  }
}