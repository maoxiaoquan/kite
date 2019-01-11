const router = require('koa-router')()
const admin = require('../controllers/client/admin')
module.exports = router.get('*', admin)
