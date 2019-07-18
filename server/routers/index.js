const router = require('koa-router')()
const apiCli = require('./apiCli')
const { lowdb } = require('../../db/lowdb')

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
  router.use('/', apiCli.routes(), apiCli.allowedMethods())
}

module.exports = router
