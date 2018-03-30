const router = require('koa-router')();
const index = require('../controllers/index');

router.get('/', index); // 主页

module.exports = router