const router = require('koa-router')()
const render = require('../../client_ssr/server/render')

module.exports = router.get('*', render)
