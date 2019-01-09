const { lowdb } = require('../db/lowdb/index')

const config = lowdb.read()
  .value()

module.exports = {
  // 密码盐
  port: {
    client_dev: 8081, // 前端 srr 开发环境端口
    product: 8086, // 生产环境端口
    admin_dev: 8083, // 后台react开发端口
  },
  encrypt_key: 'fate',
  database: {
    /* database set */
    DATABASE: config.mysql.database, // 使用哪个数据库
    USERNAME: config.mysql.username, // 用户名
    PASSWORD: config.mysql.password, // 口令
    SQL_TYPE: 'mysql', // 数据库类型
    HOST: config.mysql.host, // 主机名
    MYSQL_PORT: config.mysql.mysql_port, // 端口号，MySQL默认3306
  },
  // 邮件配置
  email: {
    service: config.email.service,
    user: config.email.user,
    pass: config.email.pass,
  },
}
