const Seq = require('sequelize')

module.exports = {
  AD_USER: 'ad_user', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 自增ID
      type: Seq.INTEGER(10),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增'
    },
    account: { // 账户
      type: Seq.CHAR(16),
      comment: '账户'
    },
    nickname: { // 昵称
      type: Seq.STRING(16),
      comment: '昵称'
    },
    password: { // 密码
      type: Seq.STRING(100),
      comment: '密码'
    },
    phone: { // 手机号码
      type: Seq.STRING(15),
      comment: '手机号码'
    },
    email: { // 自增ID
      type: Seq.STRING(16),
      comment: '主键，自增'
    },
    reg_ip: { // 注册IP
      type: Seq.STRING(16),
      comment: '注册IP'
    }
  }
}