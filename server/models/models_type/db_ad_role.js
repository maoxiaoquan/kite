const Seq = require('sequelize')

module.exports = {
  NAME: 'ad_role', /*表名*/
  TABLE: {
    /*表结构*/
    role_id: { // 角色ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field:'role_id'
    },
    role_name: { // 角色名字
      type: Seq.STRING(100),
      comment: '账户',
      field: 'role_name'
    },
    role_description: { // 角色描述
      type: Seq.STRING(100),
      comment: '角色描述',
      field: 'role_description'
    }
  }
}

