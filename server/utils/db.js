const Seq = require('sequelize');
const config = require('./../../config')

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
  }
);


exports.User = sequelize.define('user', {
  id: {
    type: Seq.INTEGER(50),
    primaryKey: true, // 定义主键
    autoIncrement: true, // 自动递增
    comment: '主键，自增'
  },
  name: Seq.STRING(255),
  password: Seq.STRING(100),
  email: Seq.STRING(100)
}, {
    timestamps: false
  });

exports.Article = sequelize.define('article', {
  id: {
    type: Seq.INTEGER(50),
    primaryKey: true, // 定义主键
    autoIncrement: true, // 自动递增
    comment: '主键，自增'
  },
  name: Seq.STRING(255),
  password: Seq.STRING(100),
  email: Seq.STRING(100)
}, {
    timestamps: false
  });

