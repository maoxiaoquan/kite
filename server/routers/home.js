const router = require('koa-router')();
const index = require('../controllers/index');
const article = require('../controllers/article');

router.get('/', index); // 主页
router.get('article', article); // 文章内容页

module.exports = router