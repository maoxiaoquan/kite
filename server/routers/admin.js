const router = require('koa-router')();
const admin = require('../controllers/web/admin');

module.exports = router.get('*', admin);
