const Seq = require('sequelize')
const config = require('../../config')

const sequelize = new Seq(
  config.database, // 数据库名
  config.username,   // 用户名
  config.password,   // 用户密码
  {
    'dialect': config.sql_type,  // 数据库使用mysql
    'host': config.host, // 数据库服务器ip
    'port': config.mysql_port,        // 数据库服务器端口
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

const ad_user = sequelize.define('ad_user', require('./db_type/ad_user'), { /*后台用户表*/
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
  ad_user,
  userInfo
}

