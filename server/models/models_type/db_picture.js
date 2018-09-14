const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../../utils/time')

module.exports = {
  NAME: 'picture', /*表名*/
  TABLE: {
    /*表结构*/
    picture_id: { //图片ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'picture_id'
    },
    picture_title: { // 图片标题
      type: Seq.STRING(20),
      comment: '图片标题',
      field: 'picture_title'
    },
    picture_url: { // 图片的路径
      type: Seq.STRING(50),
      comment: '图片的路径',
      field: 'picture_url'
    },
    picture_type: { // 图片的类型  可以是首页轮播图的，还有广告的，属于站点配置类图片
      type: Seq.STRING(20),
      comment: '图片的类型',
      field: 'picture_type'
    },
    create_date: { // 创建时间
      type: Seq.DATE,
      comment: '创建时间',
      field: 'create_date',
      defaultValue: time.TimeNow.time /*时间*/
    },
    create_date_timestamp: { // 创建时间戳
      type: Seq.BIGINT(30),
      comment: '创建时间戳',
      field: 'create_date_timestamp',
      defaultValue: time.TimeNow.timestamp /*时间戳 */
    },
    enable: { // 是否可以显示
      type: Seq.BOOLEAN,
      comment: '是否可以显示',
      field: 'enable'
    }
  }
}