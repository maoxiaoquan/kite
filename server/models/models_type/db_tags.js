const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'tags', /*表名*/
  TABLE: {
    /*表结构*/
    tag_id: { //标签ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'tag_id 主键，自增',
      field: 'tag_id'
    },
    tag_name: { // 标签名字
      type: Seq.STRING(20),
      comment: '标签名字',
      field: 'tag_name'
    },
    tag_us_name: { // 标签英文名字
      type: Seq.STRING(20),
      comment: '标签英文名字',
      field: 'tag_us_name'
    },
    tag_icon: { // 标签图标
      type: Seq.STRING(20),
      comment: '标签',
      field: 'tag_icon'
    },
    tag_icon_type: { // 标签图标类型 1是图片 2是字体图标
      type: Seq.INTEGER(20),
      comment: '标签图标类型',
      field: 'tag_icon_type'
    },
    tag_description: { // 标签描述
      type: Seq.STRING(100),
      comment: '标签描述',
      field: 'tag_description'
    }
  }
}