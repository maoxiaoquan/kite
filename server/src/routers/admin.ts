import express from 'express'
import path from 'path'
import fs from 'fs'

const router = express.Router()

module.exports = router.get('*', async (req, res, netx) => {
  const html = fs.readFileSync(
    path.resolve(__dirname, '../../../static/_admin/index.html'),
    'utf-8'
  )
  res.send(html)
})
