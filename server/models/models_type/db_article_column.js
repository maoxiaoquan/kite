const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'article_column', /*表名*/
  TABLE: {
    /*表结构*/
    article_column_id: { //专栏ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'article_column_id'
    },
    article_column_name: { // 专栏名字
      type: Seq.STRING(20),
      comment: '专栏名字',
      field: 'article_column_name'
    },
    article_column_icon: { // 专栏图标
      type: Seq.STRING(20),
      comment: '专栏',
      field: 'article_column_icon'
    },
    article_column_subscribe: { // 专栏订阅数量
      type: Seq.INTEGER(10),
      comment: '专栏订阅数量',
      field: 'article_column_subscribe'
    },
    article_column_icon_type: { // 专栏图标类型 1是图片 2是字体图标
      type: Seq.STRING(20),
      comment: '专栏图标类型',
      field: 'article_column_icon_type'
    },
    article_column_tags: { // 专栏下属的标签名，以逗号隔开
      type: Seq.STRING(100),
      comment: '专栏下属的标签名，以逗号隔开',
      field: 'article_column_tags'
    },
    article_column_description: { // 专栏描述
      type: Seq.STRING(100),
      comment: '专栏描述',
      field: 'article_column_description'
    },
    create_date: { // 创建时间
      type: Seq.BIGINT(50),
      comment: '创建时间',
      field: 'create_date'
    },
    enable: { // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}