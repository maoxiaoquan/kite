const { lowdb } = require('../../db/lowdb')
const kiteConfig = require('../../kite.config')
const API_VERSION = 'v1' // 接口版本

const cli = lowdb
  .read()
  .get('cli')
  .value()
const config = lowdb
  .read()
  .get('config')
  .value()

module.exports = app => {
  if (cli.is_success) {
    // 项目未进行初始化时 router 是无法载入需要连接数据库的配置的路由
    const apiClient = require('./apiClient')
    const apiAdmin = require('./apiAdmin')
    const client = require('./client')
    const admin = require('./admin')

    app
      .use(`/api-client/${API_VERSION}`, apiClient)
      .use(`/api-admin/${API_VERSION}`, apiAdmin)
      .use(`/${config.admin_url}`, admin)
      .use('/', client)
  } else {
    console.log('项目还未初始化，请初始化后再继续进行当前操作......')
    console.log(
      `运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`
    )
    app.use('*', async (req, res, next) => {
      res.send(
        `项目还未初始化，请初始化后再进行继续操作,运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`
      )
    })
  }
}
