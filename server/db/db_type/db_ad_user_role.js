const Seq = require('sequelize')

module.exports = {
  NAME: 'ad_user_role', /*表名*/
  TABLE: {
    /*表结构*/
    connection_id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '关系ID 主键，自增',
      field:'connection_id'
    },
    uid: { // 角色ID
      type: Seq.INTEGER(10),
      comment: '角色ID',
      field: 'uid'
    },
    role_id: { // 权限父ID
      type: Seq.INTEGER(10),
      comment: '权限父ID',
      field: 'role_id'
    }
  }
}