const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'admin_system_log' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      // 关系ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    uid: {
      // 后台用户ID
      type: Seq.INTEGER(10),
      comment: 'uid',
      field: 'uid'
    },
    type: {
      // 类型 1 创建  2 修改 3 删除 4 登录
      type: Seq.INTEGER(10),
      comment: 'type',
      field: 'type'
    },
    content: {
      // 内容
      type: Seq.TEXT,
      comment: '内容',
      field: 'content'
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
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    }
  }
}
