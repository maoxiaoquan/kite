const Seq = require('sequelize')
const time = require('../time')

module.exports = {
  NAME: 'verify_code' /*表名*/,
  TABLE: {
    /*表结构*/
    id: {
      // 自增ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    phone: {
      // 手机号码
      type: Seq.STRING(15),
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
    type: {
      // 验证码类型
      type: Seq.STRING(20),
      comment: '验证码类型',
      field: 'type'
    },
    expire_time: {
      // 验证码过期时间
      type: Seq.BIGINT(50),
      comment: '过期时间',
      field: 'expire_time'
    }
  }
}
