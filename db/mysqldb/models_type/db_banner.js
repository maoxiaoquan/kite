const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'banner' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      //bannerID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id' //  相应的字段名称
    },
    article_url: {
      // 文章id
      type: Seq.STRING(20),
      comment: '文章的链接',
      field: 'article_url'
    },
    title: {
      // banner
      type: Seq.STRING(20),
      comment: '标题的名称',
      field: 'title'
    },
    img_url: {
      // 图片的路径
      type: Seq.STRING(50),
      comment: '图片的路径',
      field: 'img_url'
    },
    type: {
      //   banner 的类型可以是首页轮播图的，还有广告的，属于站点配置类图片
      type: Seq.STRING(20),
      comment: '图片的类型',
      field: 'type'
    },
    sort:{
      //sort
      type: Seq.INTEGER(6),
      comment: 'sort',
      field: 'sort' //  sort 排序
    },
    create_date: {
      // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time // 时间
    },
    description: {
      // 标签描述
      type: Seq.STRING(100),
      comment: '描述',
      field: 'description' // 描述
    },
    create_date_timestamp: {
      // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
    enable: {
      // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}
