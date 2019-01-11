const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'article_tag' /*表名*/,
  TABLE: {
    /* 表结构 */
    article_tag_id: {
      // 标签ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'article_tag_id'
    },
    article_tag_name: {
      // 标签名字
      type: Seq.STRING(50),
      comment: '标签名字',
      field: 'article_tag_name'
    },
    article_tag_us_name: {
      // 标签英文名字
      type: Seq.STRING(100),
      comment: '标签英文名字',
      field: 'article_tag_us_name'
    },
    article_tag_icon: {
      // 标签图标地址
      type: Seq.STRING(160),
      comment: '标签图标地址',
      field: 'article_tag_icon'
    },
    article_tag_icon_type: {
      // 标签图标类型 1是图片 2是字体图标
      type: Seq.STRING(20),
      comment: '标签图标类型',
      field: 'article_tag_icon_type'
    },
    article_tag_description: {
      // 标签描述
      type: Seq.STRING(100),
      comment: '标签描述',
      field: 'article_tag_description'
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    },
    ...time.create_date
  }
}
