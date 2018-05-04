const Seq = require('sequelize')
module.exports = {
  NAME: 'user', /*表名*/
  TABLE: {
    /*表结构*/
    id: { // 自增ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id'
    },
    user_id: { // u_id
      type: Seq.STRING(50),
      comment: 'user_id',
      field: 'user_id',
      defaultValue: Seq.UUIDV1()
    },
    avatar: { // 头像
      type: Seq.STRING(100),
      comment: '头像',
      field: 'avatar'
    },
    nickname: { // 昵称
      type: Seq.STRING(16),
      comment: '昵称',
      field: 'nickname'
    },
    password: { // 密码
      type: Seq.STRING(100),
      comment: '密码',
      field: 'password'
    },
    sex: { // 性别
      type: Seq.STRING(10),
      comment: '性别',
      field: 'sex'
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
    reg_ip: { // 注册IP
      type: Seq.STRING(16),
      comment: '注册IP',
      field: 'reg_ip'
    },
    last_sign_ip: { // 最后登录ip
      type: Seq.STRING(16),
      comment: '最后登录ip',
      field: 'last_sign_ip'
    },
    reg_time: { // 注册时间
      type: Seq.BIGINT(50),
      comment: '注册时间',
      field: 'reg_time'
    },
    last_sign_time: { // 最后登录时间
      type: Seq.BIGINT(50),
      comment: '最后登录时间',
      field: 'last_sign_time'
    }
  }
}