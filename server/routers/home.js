const router = require('koa-router')();
const index = require('../controllers/index');

router.get('/', index);

module.exports = router