const express = require('express')
const router = express.Router()
const render = require('../../client/server/render')
router.get('*', render)
module.exports = router
