const Seq = require('sequelize')
module.exports = {
  NAME: 'article_category', /*表名*/
  TABLE: {
    /*表结构*/
    category_id: { // 分类ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '关系ID 主键，自增',
      field:'category_id'
    },
    category_name: { // 类别
      type: Seq.STRING(20),
      comment: '分类名字',
      field: 'category_name'
    }
  }
}