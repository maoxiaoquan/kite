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
    profession: { // 职业
      type: Seq.STRING(20),
      comment: 'profession',
      field: 'profession'
    },
    home_page: { // 个人主页
      type: Seq.STRING(20),
      comment: 'home_page',
      field: 'home_page'
    }
  }
}