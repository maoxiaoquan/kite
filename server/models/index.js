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
const user = sequelize.define(require('./models_type/db_user').NAME, require('./models_type/db_user').TABLE, SEQ_PARAMETER)
/*前台用户信息表*/
const user_info = sequelize.define(require('./models_type/db_user_info').NAME, require('./models_type/db_user_info').TABLE, SEQ_PARAMETER)
/*前台用户注册验证码*/
const verify_code = sequelize.define(require('./models_type/db_verify_code').NAME, require('./models_type/db_verify_code').TABLE, SEQ_PARAMETER)
/*前台文章表*/
const article = sequelize.define(require('./models_type/db_article').NAME, require('./models_type/db_article').TABLE, SEQ_PARAMETER)
/*前台文章官方标签表*/
const article_tag = sequelize.define(require('./models_type/db_article_tag').NAME, require('./models_type/db_article_tag').TABLE, SEQ_PARAMETER)
/*前台文章官方专栏*/
const article_column = sequelize.define(require('./models_type/db_article_column').NAME, require('./models_type/db_article_column').TABLE, SEQ_PARAMETER)
/*前台用户文章专题表*/
const user_article_topic = sequelize.define(require('./models_type/db_user_article_topic').NAME, require('./models_type/db_user_article_topic').TABLE, SEQ_PARAMETER)
/*前台用户角色表*/
const user_tag = sequelize.define(require('./models_type/db_user_tag').NAME, require('./models_type/db_user_tag').TABLE, SEQ_PARAMETER)
/*前台图片表*/
const picture = sequelize.define(require('./models_type/db_picture').NAME, require('./models_type/db_picture').TABLE, SEQ_PARAMETER)

/*----------------------------------后台表---------------------------------------*/

/*后台用管理员表*/
const admin_user = sequelize.define(require('./models_type/db_admin_user').NAME, require('./models_type/db_admin_user').TABLE, SEQ_PARAMETER)
/*后台角色表*/
const admin_role = sequelize.define(require('./models_type/db_admin_role').NAME, require('./models_type/db_admin_role').TABLE, SEQ_PARAMETER)
/*用户与角色关系表*/
const admin_user_role = sequelize.define(require('./models_type/db_admin_user_role').NAME, require('./models_type/db_admin_user_role').TABLE, SEQ_PARAMETER)
/*权限表*/
const admin_authority = sequelize.define(require('./models_type/db_admin_authority').NAME, require('./models_type/db_admin_authority').TABLE, SEQ_PARAMETER)
/*角色与权限关系表*/
const admin_role_authority = sequelize.define(require('./models_type/db_admin_role_authority').NAME, require('./models_type/db_admin_role_authority').TABLE, SEQ_PARAMETER)

module.exports = {
  sequelize,
  user,
  user_tag,
  user_info,
  user_article_topic,
  verify_code,
  article,
  article_tag,
  article_column,
  picture,
  admin_user,
  admin_role,
  admin_user_role,
  admin_authority,
  admin_role_authority
}
