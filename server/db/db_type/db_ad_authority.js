const Seq = require('sequelize')

module.exports = {
  NAME: 'ad_authority', /*表名*/
  TABLE: {
    /*表结构*/
    authority_id: { // 权限ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '权限ID 主键，自增',
      field:'authority_id'
    },
    authority_name : { // 权限名字
      type: Seq.CHAR(100),
      comment: '权限名字',
      field: 'authority_name'
    },
    authority_parent_id : { // 权限父ID
      type: Seq.INTEGER(10),
      comment: '权限父ID',
      field: 'authority_parent_id'
    },
    authority_url : { // 权限树的连接路径
      type: Seq.CHAR(100),
      comment: '权限树的连接路径',
      field: 'authority_url'
    }
  }
}