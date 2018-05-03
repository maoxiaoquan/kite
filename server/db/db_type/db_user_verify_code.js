const Seq = require('sequelize')
module.exports = {
  NAME: 'user_verify_code', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 自增ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    phone: { // 手机号码
      type: Seq.STRING(15),
      comment: '手机号码',
      field: 'phone'
    },
    email: { // 邮箱
      type: Seq.STRING(36),
      comment: '邮箱',
      field: 'email'
    },
    verify_code: { // 验证码
      type: Seq.STRING(36),
      comment: '验证码',
      field: 'verify_code'
    },
    expire_time: { // 验证码过期时间
      type: Seq.DATE,
      comment: '过期时间',
      field: 'expire_time'
    }
  }
}