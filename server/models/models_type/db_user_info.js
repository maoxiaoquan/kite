const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_info', /*表名*/
  TABLE: {
    /*表结构*/
    uid: { // 权限ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      comment: 'uid',
      field: 'uid'
    },
    role_names: {
      type: Seq.STRING(100),
      comment: '用户的角色',
      field: 'user_roles'
    },
    topics: {
      type: Seq.STRING(100),
      comment: '用户关注的专题',
      field: 'user_topics'
    },
    user_attention: {
      type: Seq.STRING(100),
      comment: '用户关注的用户',
      field: 'user_joins'
    }
  }
}