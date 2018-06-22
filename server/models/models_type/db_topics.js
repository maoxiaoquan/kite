const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'topics', /*表名*/
  TABLE: {
    /*表结构*/
    topics_id: { // 专题ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'topics_id 主键，自增',
      field:'topics_id'
    },
    topics_name: { // 专题名字
      type: Seq.STRING(20),
      comment: '分类名字',
      field: 'tag_name'
    },
    topics_icon: { // 专题图标
      type: Seq.STRING(20),
      comment: '专题图标',
      field: 'topics_icon'
    },
    topics_icon_type: { // 专题图标类型
      type: Seq.INTEGER(20),
      comment: '专题图标类型',
      field: 'topics_icon_type'
    },
    topics_description: { // 专题描述
      type: Seq.STRING(100),
      comment: '专题描述',
      field: 'tag_description'
    }
  }
}