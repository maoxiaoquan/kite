const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

module.exports = router.get('*', async ctx => {
  const html = fs.readFileSync(
    path.resolve(__dirname, '../../static/_admin/index.html'),
    'utf-8'
  )
  ctx.response.body = html
})
