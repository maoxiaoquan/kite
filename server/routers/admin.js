const router = require('koa-router')()
const path = require('path')
const fs = require('fs')

module.exports = router.get('*', async (ctx) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../static/dist/index.html'), 'utf-8')
  ctx.response.body = html
})
