const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')

module.exports = {
  NAME: 'user' /* 表名 */,
  TABLE: {
    /* 表结构 */
    uid: {
      // 用户ID
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'uid 主键，自增',
      field: 'uid' //  相应的字段名称
    },
    username: {
      // 昵称
      type: Seq.STRING(200),
      comment: '用户名',
      field: 'username'
    },
    avatar: {
      // 头像
      type: Seq.STRING(200),
      comment: '头像',
      field: 'avatar'
    },
    nickname: {
      // 昵称
      type: Seq.STRING(16),
      comment: '昵称',
      field: 'nickname'
    },
    password: {
      // 密码
      type: Seq.STRING(100),
      comment: '密码',
      field: 'password'
    },
    sex: {
      // 性别  1 boy  2 girl 0 secret
      type: Seq.INTEGER(6),
      comment: '性别',
      field: 'sex'
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
    reg_ip: {
      // 注册IP
      type: Seq.STRING(120),
      comment: '注册IP',
      field: 'reg_ip'
    },
    last_sign_ip: {
      // 最后登录ip
      type: Seq.STRING(120),
      comment: '最后登录ip',
      field: 'last_sign_ip'
    },
    last_sign_date: {
      // 最后登录时间
      type: Seq.DATE,
      comment: '最后登录时间',
      field: 'last_sign_date'
    },
    introduction: {
      // 简介
      type: Seq.TEXT,
      comment: '简介',
      field: 'introduction'
    },
    user_role_ids: {
      type: Seq.STRING(100),
      comment: '用户的角色标签',
      field: 'user_role_ids'
    },
    enable: {
      // 是否可以登录
      type: Seq.BOOLEAN,
      comment: '是否可以登录',
      field: 'enable'
    },
    ban_dt: {
      // 禁言时间
      type: Seq.DATE,
      comment: '禁言时间',
      field: 'ban_dt'
    },
    update_date: {
      // 更新时间
      type: Seq.DATE,
      comment: '更新时间',
      field: 'update_date'
    },
    update_date_timestamp: {
      // 更新时间戳
      type: Seq.BIGINT(30),
      comment: '更新时间戳',
      field: 'update_date_timestamp'
    },
    ...time.create_date
  }
}
