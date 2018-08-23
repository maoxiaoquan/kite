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
    user_tag_ids: {
      type: Seq.STRING(100),
      comment: '用户的标签',
      field: 'user_tag_ids'
    }
  }
}