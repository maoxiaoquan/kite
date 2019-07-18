const Seq = require('sequelize')
const time = require('../time')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_role' /* 表名 */,
  TABLE: {
    /* 表结构 */
    user_role_id: {
      // 用户角色ID
      type: Seq.STRING(20),
      comment: '权限ID',
      defaultValue: shortid.generate,
      field: 'user_role_id',
      primaryKey: true // 定义主键
    },
    user_role_name: {
      // 用户角色名字
      type: Seq.STRING(100),
      comment: '用户角色名字',
      field: 'user_role_name'
    },
    user_role_description: {
      // 用户角色描述
      type: Seq.STRING(100),
      comment: '用户角色描述',
      field: 'user_role_description'
    },
    user_role_type: {
      // 状态
      type: Seq.INTEGER(5),
      comment:
        '判断角色的类型，1：默认普通角色，可设置权限，2：定制化角色，不可设置权限，通过代码定制化权限',
      field: 'user_role_type'
    },
    user_role_icon: {
      // 用户角色图标
      type: Seq.STRING(200),
      comment: '用户角色图标',
      field: 'user_role_icon'
    },
    user_authority_ids: {
      // 角色权限id列表
      type: Seq.TEXT('long'),
      comment: '角色权限id列表',
      field: 'user_authority_ids'
    },
    is_show: {
      // 是否有效
      type: Seq.BOOLEAN,
      comment: '是否在个人中心显示',
      field: 'is_show'
    },
    enable: {
      // 是否有效
      type: Seq.BOOLEAN,
      comment: '是否有效',
      field: 'enable'
    },
    ...time.create_date
  }
}
