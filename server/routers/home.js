const router = require('koa-router')()
const index = require('../controllers/index')// 主页
const sign_in = require('../controllers/sign_in')// 登录
const sign_up = require('../controllers/sign_up')// 注册
const article = require('../controllers/article') // 文章内容页
const writer = require('../controllers/writer')// 编写文章
const article_list = require('../controllers/article_list')// 编写文章

router.get('/', index) // 主页

router.get('sign_in', sign_in.get_sign_in) // 登录
router.post('sign_in', sign_in.post_sign_in) // 登录数据 post

router.get('sign_up', sign_up.get_sign_up) // 注册
router.post('sign_up', sign_up.post_sign_up) // 注册数据 post

router.get('article', article) // 文章内容页
router.get('writer', writer) // 编写文章
router.get('article_list', article_list) // 文章列表

module.exports = router