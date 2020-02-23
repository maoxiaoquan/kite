const Seq = require('sequelize')
const shortid = require('shortid')
const time = require('../time')
module.exports = {
  NAME: 'user_info' /* 表名 */,
  TABLE: {
    /* 表结构 */
    id: {
      // 唯一id
      type: Seq.BIGINT(20),
      primaryKey: true, // 定义主键
      autoIncrement: true, // 自动递增
      comment: 'id 主键，自增',
      field: 'id' //  相应的字段名称
    },
    uid: {
      // 权限ID
      type: Seq.BIGINT(20),
      comment: 'uid',
      field: 'uid'
    },
    identity_type: {
      // 职业
      type: Seq.STRING(50),
      comment: '身份类型 github qq weixin',
      field: 'identity_type'
    },
    identifier: {
      // 职业
      type: Seq.STRING(50),
      comment: '身份唯一标识（存储唯一标识，第三方获取的唯一标识等）',
      field: 'identifier'
    },
    credential: {
      // 职业
      type: Seq.STRING(50),
      comment: '授权凭证（比如密码 第三方登录的token等）',
      field: 'credential'
    },
    verified: {
      // 职业
      type: Seq.STRING(50),
      comment: '是否已经验证（存储 1、0 来区分是否已经验证通过）',
      field: 'verified'
    }
  }
}
