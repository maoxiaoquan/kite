const Seq = require('sequelize')
module.exports = {
  NAME: 'article_tags_connection', /*表名*/
  TABLE: {
    /*表结构*/
    connection_id: { // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field:'connection_id'
    },
    tag_id: { // 标签ID
      type: Seq.STRING(20),
      comment: 'tag_id',
      field: 'tag_id'
    },
    aid: { // 文章id
      type: Seq.STRING(20),
      comment: '文章id',
      field: 'aid'
    }
  }
}