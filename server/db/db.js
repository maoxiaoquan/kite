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
      'underscored': true,
    }
  },
)

const SEQ_PARAMETER = {
  timestamps: false,
  freezeTableName: true
}

sequelize.authenticate().then(() => {
  console.log('链接成功')
}).catch((error) => {
  console.log('链接失败' + error)
})

/*----------------------------------前台表---------------------------------------*/

/*前台用户表*/
const db_user = require('./db_type/db_user')
const user = sequelize.define(db_user.NAME, db_user.TABLE, SEQ_PARAMETER)

/*前台用户注册验证码*/
const db_user_verify_code = require('./db_type/db_user_verify_code')
const user_verify_code = sequelize.define(db_user_verify_code.NAME, db_user_verify_code.TABLE, SEQ_PARAMETER)

/*前台文章表*/
const db_article = require('./db_type/db_article')
const article = sequelize.define(db_article.NAME, db_article.TABLE, SEQ_PARAMETER)

/*----------------------------------后台表---------------------------------------*/
/*后台用户表*/
const db_ad_user = require('./db_type/db_ad_user')
const ad_user = sequelize.define(db_ad_user.NAME, db_ad_user.TABLE, SEQ_PARAMETER)

/*后台角色表*/
const db_ad_role = require('./db_type/db_ad_role')
const ad_role = sequelize.define(db_ad_role.NAME, db_ad_role.TABLE, SEQ_PARAMETER)

/*用户与角色关系表*/
const db_ad_user_role = require('./db_type/db_ad_user_role')
const ad_user_role = sequelize.define(db_ad_user_role.NAME, db_ad_user_role.TABLE, SEQ_PARAMETER)

/*权限表*/
const db_ad_authority = require('./db_type/db_ad_authority')
const ad_authority = sequelize.define(db_ad_authority.NAME, db_ad_authority.TABLE, SEQ_PARAMETER)

/*角色与权限关系表*/
const db_ad_role_authority = require('./db_type/db_ad_role_authority')
const ad_role_authority = sequelize.define(db_ad_role_authority.NAME, db_ad_role_authority.TABLE, SEQ_PARAMETER)

module.exports = {
  sequelize,
  user,
  user_verify_code,
  article,
  ad_user,
  ad_role,
  ad_user_role,
  ad_authority,
  ad_role_authority
}

