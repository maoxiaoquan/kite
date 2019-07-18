const router = require('koa-router')()
const render = require('../../client/server/render')

module.exports = router.get('*', render)
