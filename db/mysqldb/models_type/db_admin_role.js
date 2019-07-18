const Seq = require('sequelize')
const time = require('../time')
module.exports = {
  NAME: 'admin_role' /* 表名 */,
  TABLE: {
    /* 表结构 */
    role_id: {
      // 角色ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'role_id'
    },
    role_name: {
      // 角色名字
      type: Seq.STRING(100),
      comment: '账户',
      field: 'role_name'
    },
    role_description: {
      // 角色描述
      type: Seq.STRING(100),
      comment: '角色描述',
      field: 'role_description'
    },
    admin_authority_ids: {
      // 角色权限id列表
      type: Seq.TEXT('long'),
      comment: '角色权限id列表',
      field: 'admin_authority_ids'
    },
    ...time.create_date
  }
}
