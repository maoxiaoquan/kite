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

sequelize
  .authenticate()
  .then(() => {
    console.log('链接成功');
  })
  .catch((error) => {
    console.log('链接失败' + error);
  })


const ad_user = sequelize.define('ad_user', {
  id: { // 自增ID
    type: Seq.INTEGER(10),
    primaryKey: true, // 定义主键
    autoIncrement: true, // 自动递增
    comment: 'id 主键，自增'
  },
  account: { // 账户
    type: Seq.CHAR(16),
    comment: '账户'
  },
  nickname: { // 昵称
    type: Seq.STRING(16),
    comment: '昵称'
  },
  password: { // 密码
    type: Seq.STRING(100),
    comment: '密码'
  },
  phone: { // 手机号码
    type: Seq.STRING(15),
    comment: '手机号码'
  },
  email: { // 自增ID
    type: Seq.STRING(16),
    comment: '主键，自增'
  },
  reg_ip: { // 注册IP
    type: Seq.STRING(16),
    comment: '注册IP'
  }
}, {
    timestamps: false
  });

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
  });

module.exports = {
  ad_user,
  userInfo
}

