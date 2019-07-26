const router = require('koa-router')()
const apiCli = require('./apiCli')

router.use('/', apiCli.routes(), apiCli.allowedMethods()) // 初始化进入的接口

module.exports = router
