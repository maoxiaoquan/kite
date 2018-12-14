const Seq = require('sequelize')
// const config = require('../../config')
const config = require('../../config')

/*表字段*/

const sequelize = new Seq(
  config.database.DATABASE, // 数据库名
  config.database.USERNAME, // 用户名
  config.database.PASSWORD, // 用户密码
  {
    dialect: 'mysql', // 数据库使用mysql
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    host: config.database.HOST, // 数据库服务器ip
    port: config.database.MYSQL_PORT, // 数据库服务器端口
    timezone: '+8:00',// 设置东八区
    define: {
      // 字段以下划线（_）来分割（默认是驼峰命名风格）
      underscored: true
    }
  }
)

sequelize
  .authenticate()
  .then(() => {
    console.log('链接成功')
  })
  .catch(error => {
    console.log('链接失败' + error)
  })

const define = require('./define')(sequelize)

/* 表关联 已遗弃*/
/*user.hasMany(comment, {foreignKey: 'uid',as:'user'})*/
/*comment.belongsTo(user, {foreignKey: 'uid',as:'user'})
user_message.belongsTo(user, {foreignKey: 'other_uid',as:'other_user'})
article.belongsTo(user, {foreignKey: 'uid',as:'user'})*/

module.exports = {
  Seq,
  ...define
}
