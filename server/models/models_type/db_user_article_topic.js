const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'user_article_topic', /*表名*/
  TABLE: {
    /*表结构*/
    user_article_topic_id: { // 专题ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '专题ID',
      field:'user_article_topic_id'
    },
    user_article_topic_name: { // 专题名字
      type: Seq.STRING(20),
      comment: '专题名字',
      field: 'user_article_topic_name'
    },
    user_article_topic_description: { // 专题描述
      type: Seq.STRING(100),
      comment: '专题描述',
      field: 'user_article_topic_description'
    },
    user_article_topic_subscribe: { // 专题订阅数量
      type: Seq.INTEGER(10),
      comment: '专题订阅数量',
      field: 'user_article_topic_subscribe'
    },
    user_article_topic_icon: { // 专题图标
      type: Seq.STRING(20),
      comment: '专题图标',
      field: 'user_article_topic_icon'
    },
    user_article_topic_icon_type: { // 专题图标类型 1是图片 2是字体图标
      type: Seq.INTEGER(20),
      comment: '标签图标类型',
      field: 'user_article_topic_icon_type'
    },
    create_date: { // 创建时间
      type: Seq.BIGINT(50),
      comment: '创建时间',
      field: 'create_date'
    },
    uid: { // 专题ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field:'uid'
    },
    enable: { // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}