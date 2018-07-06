const Seq = require('sequelize')
const shortid = require('shortid')
module.exports = {
  NAME: 'article_topic', /*表名*/
  TABLE: {
    /*表结构*/
    article_topic_id: { // 专题ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '专题ID',
      field:'article_topic_id'
    },
    article_topic_name: { // 专题名字
      type: Seq.STRING(20),
      comment: '专题名字',
      field: 'article_opic_name'
    },
    article_topic_description: { // 专题描述
      type: Seq.STRING(100),
      comment: '专题描述',
      field: 'article_topic_description'
    },
    article_topic_subscribe: { // 专题订阅数量
      type: Seq.INTEGER(10),
      comment: '专题订阅数量',
      field: 'article_topic_subscribe'
    },
    article_topic_icon: { // 专题图标
      type: Seq.STRING(20),
      comment: '专题图标',
      field: 'article_topic_icon'
    },
    article_topic_icon_type: { // 专题图标类型 1是图片 2是字体图标
      type: Seq.INTEGER(20),
      comment: '标签图标类型',
      field: 'article_topic_icon_type'
    },
    uid: { // 专题ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field:'uid'
    },
    nickname: { // 昵称
      type: Seq.STRING(16),
      comment: '昵称',
      field: 'nickname'
    },
    enable: { // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}