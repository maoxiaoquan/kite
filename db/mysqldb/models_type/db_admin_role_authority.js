const Seq = require('sequelize')
const time = require('../time')
module.exports = {
  NAME: 'admin_role_authority' /*表名*/,
  TABLE: {
    /*表结构*/
    connection_id: {
      // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'connection_id'
    },
    role_id: {
      // 角色ID
      type: Seq.INTEGER(10),
      comment: '角色ID',
      field: 'role_id'
    },
    authority_id: {
      //权限ID
      type: Seq.STRING(20),
      comment: '权限ID',
      field: 'authority_id'
    },
    authority_toggle: {
      // 权限的开关 true可以 false不可以
      type: Seq.BOOLEAN,
      comment: '权限的开关 true可以 false不可以',
      field: 'authority_toggle'
    }
  }
}
