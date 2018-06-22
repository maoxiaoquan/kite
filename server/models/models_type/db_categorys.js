const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'categorys', /*表名*/
  TABLE: {
    /*表结构*/
    category_id: { // 分类ID
      type: Seq.STRING(20),
      primaryKey: true, // 定义主键
      comment: 'category_id',
      defaultValue: shortid.generate,
      field: 'category_id'
    },
    category_name: { // 类别
      type: Seq.STRING(20),
      comment: '分类名字',
      field: 'category_name'
    },
    category_parent_id: { // 分类父ID
      type: Seq.STRING(20),
      comment: '分类父ID',
      field: 'category_parent_id'
    },
    category_parent_name: { // 分类父name
      type: Seq.STRING(20),
      comment: '分类父name',
      field: 'category_parent_name'
    },
    category_description: { // 分类描述
      type: Seq.STRING(100),
      comment: '分类描述',
      field: 'category_description'
    }
  }
}