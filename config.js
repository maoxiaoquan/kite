const { lowdb } = require('./db/lowdb')

const config = lowdb.read().value()

module.exports = {
  cli_port: 8060, // cli port
  dev_port: 8061, // 前台开发端口
  produce_port: 8062, // server端口
  // 密码盐
  encrypt_key: 'fate',
  database: {
    /*database set*/
    DATABASE: config.mysql.database, // 使用哪个数据库
    USERNAME: config.mysql.username, // 用户名
    PASSWORD: config.mysql.password, // 口令
    SQL_TYPE: 'mysql', // 数据库类型
    HOST: config.mysql.host, // 主机名
    MYSQL_PORT: config.mysql.mysql_port // 端口号，MySQL默认3306
  },
  //邮件配置
  email: {
    service: config.email.service,
    user: config.email.user,
    pass: config.email.pass
  }
}
