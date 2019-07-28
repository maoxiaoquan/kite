const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'system_log' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 关系ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    uid: {
      // 后台用户ID
      type: Seq.STRING(20),
      comment: 'uid',
      field: 'uid'
    },
    type: {
      // 类型 1 创建  2 更新 3 删除 4 登录
      type: Seq.INTEGER(10),
      comment: '类型 1:创建,2:更新,3:删除,4:登录',
      field: 'type'
    },
    content: {
      // 内容
      type: Seq.TEXT,
      comment: '内容',
      field: 'content'
    },
    is_read: {
      // 是否被阅读
      type: Seq.BOOLEAN,
      comment: '是否被阅读',
      field: 'is_read',
      defaultValue: false
    },
    ...time.create_date
  }
}
