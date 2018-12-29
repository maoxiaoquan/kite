const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'picture' /*表名*/,
  TABLE: {
    /*表结构*/
    picture_id: {
      //图片ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'picture_id'
    },
    picture_title: {
      // 图片标题
      type: Seq.STRING(20),
      comment: '图片标题',
      field: 'picture_title'
    },
    picture_url: {
      // 图片的路径
      type: Seq.STRING(50),
      comment: '图片的路径',
      field: 'picture_url'
    },
    description: {
      // 图片的备注。作用等等
      type: Seq.STRING(100),
      comment: '图片的类型',
      field: 'description'
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
