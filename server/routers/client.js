const express = require('express')
const router = express.Router()
const render = require('../../client/server/render')

module.exports = router.get('*', render)
