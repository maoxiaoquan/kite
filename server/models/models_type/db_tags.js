const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'article_tags', /*表名*/
  TABLE: {
    /*表结构*/
    tag_id: { // 标签ID
      type: Seq.STRING(20),
      primaryKey: true, // 定义主键
      comment: 'tag_id',
      defaultValue: shortid.generate,
      field: 'tag_id'
    },
    tag_name: { // 标签名字
      type: Seq.STRING(20),
      comment: '分类名字',
      field: 'tag_name'
    },
    tag_description: { // 标签描述
      type: Seq.STRING(100),
      comment: '标签描述',
      field: 'tag_description'
    }
  }
}