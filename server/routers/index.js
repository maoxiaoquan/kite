const router = require('koa-router')()
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

if (cli.is_success) {
  // 项目未进行初始化时 router 是无法载入需要连接数据库的配置的路由
  const apiClient = require('./apiClient')
  const apiAdmin = require('./apiAdmin')
  const client = require('./client')
  const admin = require('./admin')

  router.use(
    `/api-client/${API_VERSION}`,
    apiClient.routes(),
    apiClient.allowedMethods()
  )
  router.use(
    `/api-admin/${API_VERSION}`,
    apiAdmin.routes(),
    apiAdmin.allowedMethods()
  )
  router.use(`/${config.admin_url}`, admin.routes(), admin.allowedMethods())
  router.use('*', client.routes(), client.allowedMethods())
} else {
  console.log('项目还未初始化，请初始化后再继续进行当前操作......')
  console.log(
    `运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`
  )
  router.use('*', async ctx => {
    ctx.response.body = `项目还未初始化，请初始化后再进行继续操作,运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`
  })
}

module.exports = router
