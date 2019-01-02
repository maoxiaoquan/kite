const router = require('koa-router')()
const ssr = require('../../client_ssr/server')

module.exports = router.get('*', ssr)
