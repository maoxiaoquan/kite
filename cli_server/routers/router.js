const router = require('koa-router')()

const cli_web = require('./cli_web')

router.use('/', cli_web.routes(), cli_web.allowedMethods())

module.exports = router
