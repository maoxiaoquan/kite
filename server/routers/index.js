const router = require('koa-router')()
const cli_web = require('./cli')
const { lowdb } = require('../../db/lowdb')

const cli = lowdb
  .read()
  .get('cli')
  .value()

if (cli.is_success) { // 项目未进行初始化时 router 是无法载入需要连接数据库的配置
  const admins = require('./admin')
  const client = require('./client')
  const api = require('./api')
  const ssr = require('./ssr')

  router.use('/client', client.routes(), client.allowedMethods())
  router.use('/api', api.routes(), api.allowedMethods())
  router.use('/admin', admins.routes(), admins.allowedMethods())
  router.use('/', ssr.routes(), ssr.allowedMethods())
} else {
  router.use('/', cli_web.routes(), cli_web.allowedMethods())
}

module.exports = router
