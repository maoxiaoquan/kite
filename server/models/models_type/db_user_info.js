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
    role_ids: {
      type: Seq.STRING(100),
      comment: '用户的角色',
      field: 'role_ids'
    },
    tag_ids: {
      type: Seq.STRING(100),
      comment: '用户关注的标签',
      field: 'tag_ids'
    },
    topic_ids: {
      type: Seq.STRING(100),
      comment: '用户订阅的专栏',
      field: 'topic_ids'
    },
    user_attention: {
      type: Seq.STRING(100),
      comment: '用户关注的用户',
      field: 'user_attention'
    }
  }
}