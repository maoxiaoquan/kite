import express from 'express'
const router = express.Router()
const render = require('./ssrRender')
router.get('*', render)
module.exports = router
