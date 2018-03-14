const router = require('koa-router')();
const admin = require('../controllers/admin');

module.exports = router.get('*', admin);
