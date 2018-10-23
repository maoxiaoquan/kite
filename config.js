module.exports = {
  cli_port: 8060,// cli port
  dev_port: 8061,// 前台开发端口
  produce_port: 8062,// server端口
  // 密码盐
  encrypt_key: 'fate',
  database: {
    /*database set*/
    DATABASE: 'fatecms', // 使用哪个数据库
    USERNAME: 'root', // 用户名
    PASSWORD: 'root', // 口令
    SQL_TYPE: 'mysql', // 数据库类型
    HOST: 'localhost', // 主机名
    MYSQL_PORT: 3306 // 端口号，MySQL默认3306
  },
  //邮件配置
  email: {
    service: '163',
    user: 'mxq1102@163.com',
    pass: 'quan13173560961'
  }
}