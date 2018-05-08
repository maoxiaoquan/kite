const Seq = require('sequelize')
const config = require('../../config')
/*表字段*/
const sequelize = new Seq(
  config.database.DATABASE, // 数据库名
  config.database.USERNAME,   // 用户名
  config.database.PASSWORD,   // 用户密码
  {
    'dialect': config.database.SQL_TYPE,  // 数据库使用mysql
    'host': config.database.HOST, // 数据库服务器ip
    'port': config.database.MYSQL_PORT,        // 数据库服务器端口
    'define': {
      // 字段以下划线（_）来分割（默认是驼峰命名风格）
      'underscored': true
    }
  },
)

sequelize.authenticate().then(() => {
  console.log('链接成功')
}).catch((error) => {
  console.log('链接失败' + error)
})

const db_user = require('./db_type/db_user')
const user = sequelize.define(db_user.NAME, db_user.TABLE, {
  /*用户表*/
  timestamps: false
})

const db_user_verify_code = require('./db_type/db_user_verify_code')
const user_verify_code = sequelize.define(db_user_verify_code.NAME, db_user_verify_code.TABLE, {
  /*用户注册验证码*/
  timestamps: false
})

const db_article = require('./db_type/db_article')
const article = sequelize.define(db_article.NAME, db_article.TABLE, {
  /*文章表*/
  timestamps: false
})

const db_ad_user = require('./db_type/db_ad_user')
const ad_user = sequelize.define(db_ad_user.NAME, db_ad_user.TABLE, {
  /*后台用户表*/
  timestamps: false
})

const userInfo = sequelize.define('userInfo', {
  id: {
    type: Seq.INTEGER(50),
    primaryKey: true, // 定义主键
    autoIncrement: true, // 自动递增
    comment: '主键，自增'
  },
  account: { // 账户
    type: Seq.CHAR(16),
    comment: '账户'
  },
  email: Seq.STRING(100)
}, {
  timestamps: false
})

module.exports = {
  sequelize,
  user,
  user_verify_code,
  article,
  ad_user,
  userInfo
}

