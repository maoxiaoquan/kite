const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'user_article_topic' /*表名*/,
  TABLE: {
    /*表结构*/
    topic_id: {
      // 专题ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: '专题ID',
      field: 'topic_id'
    },
    topic_name: {
      // 专题名字
      type: Seq.STRING(20),
      comment: '专题名字',
      field: 'topic_name'
    },
    topic_description: {
      // 专题描述
      type: Seq.STRING(100),
      comment: '专题描述',
      field: 'topic_description'
    },
    topic_subscribe: {
      // 专题订阅数量
      type: Seq.INTEGER(10),
      comment: '专题订阅数量',
      field: 'topic_subscribe'
    },
    topic_icon: {
      // 专题图标
      type: Seq.STRING(20),
      comment: '专题图标',
      field: 'topic_icon'
    },
    topic_icon_type: {
      // 专题图标类型 1是图片 2是字体图标
      type: Seq.INTEGER(20),
      comment: '标签图标类型',
      field: 'topic_icon_type'
    },
    create_date: {
      // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: {
      // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
    uid: {
      // uid
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}
