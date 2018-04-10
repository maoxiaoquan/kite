const router = require('koa-router')()
const index = require('../controllers/index')// 主页
const sign_in = require('../controllers/sign_in')// 登录
const sign_up = require('../controllers/sign_up')// 注册
const article = require('../controllers/article') // 文章内容页
const writer = require('../controllers/writer')// 编写文章

router.get('/', index) // 主页
router.get('sign_in', sign_in) // 登录
router.get('sign_up', sign_up) // 注册
router.get('article', article) // 文章内容页
router.get('writer', writer) // 编写文章

module.exports = router