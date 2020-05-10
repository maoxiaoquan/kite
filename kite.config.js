// 此文件是 kite 的总配置文件
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'

function ProcessCwd (val) {
  return path.resolve(process.cwd(), val)
}

module.exports = {
  version: '0.9.1',
  theme: {
    'font-family': 'Microsoft YaHei'
  },
  env: NODE_ENV,
  publicStatic: ProcessCwd('static'),
  server: {
    // server
    default_avatar: '/default/img/avatar.jpeg', // 所有使用的默认头像
    port: 8086, // 生产环境运行端口号
    ininProt: 8085 // 初始化项目端口号
  }
}
