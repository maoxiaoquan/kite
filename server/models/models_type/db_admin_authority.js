const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'admin_authority', /*表名*/
  TABLE: {
    /*表结构*/
    a_id: { //ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'a_id',
      field: 'a_id'
    },
    authority_id: { // 权限ID
      type: Seq.STRING(20),
      comment: '权限ID',
      defaultValue: shortid.generate,
      field: 'authority_id'
    },
    authority_name: { // 权限名字
      type: Seq.CHAR(100),
      comment: '权限名字',
      field: 'authority_name'
    },
    authority_type: { // 权限类型
      type: Seq.CHAR(100),
      comment: '权限类型',
      field: 'authority_type'
    },
    authority_parent_id: { // 权限父ID
      type: Seq.STRING(20),
      comment: '权限父ID',
      field: 'authority_parent_id'
    },
    authority_parent_name: { // 父权限名字
      type: Seq.CHAR(100),
      comment: '父权限名字',
      field: 'authority_parent_name'
    },
    authority_url: { // 权限树的连接路径
      type: Seq.CHAR(100),
      comment: '权限树的连接路径',
      field: 'authority_url'
    },
    authority_sort: { // 权限树的连接路径
      type: Seq.INTEGER(20),
      comment: '权限树的排序',
      field: 'authority_sort'
    },
    authority_description: { // 权限描述
      type: Seq.STRING(100),
      comment: '权限描述',
      field: 'authority_description'
    }
  }
}