const Seq = require('sequelize')
const time = require('../time')

module.exports = {
  NAME: 'verify_code' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 自增ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    area_code: {
      // 邮箱
      type: Seq.STRING(12),
      comment: '区号',
      field: 'area_code'
    },
    phone: {
      // 手机号码
      type: Seq.BIGINT(28),
      comment: '手机号码',
      field: 'phone'
    },
    email: {
      // 邮箱
      type: Seq.STRING(36),
      comment: '邮箱',
      field: 'email'
    },
    verify_code: {
      // 验证码
      type: Seq.STRING(36),
      comment: '验证码',
      field: 'verify_code'
    },
    type: {
      // 验证码类型
      type: Seq.STRING(20),
      comment: '验证码类型',
      field: 'type'
    },
    ...time.create_date
  }
}
