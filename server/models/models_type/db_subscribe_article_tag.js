const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'subscribe_article_tag', /*表名*/
  TABLE: {
    /*表结构*/
    connection_id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'connection_id 主键，自增',
      field: 'connection_id'
    },
    uid: { // 用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field:'uid'
    },
    article_tag_id: { //标签ID
      type: Seq.INTEGER(10),
      comment: 'id 主键，自增',
      field: 'article_tag_id'
    }
  }
}