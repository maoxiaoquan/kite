const router = require('koa-router')();
const admin = require('../controllers/web/admin');
console.log(111)
module.exports = router.get('*', admin);
