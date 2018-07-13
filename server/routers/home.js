const router = require('koa-router')()
const {Check_Session, ajaxCheck_Session} = require('../utils/check_session')

const index = require('../controllers/index')// 主页
const sign_in = require('../controllers/sign_in')// 登录
const sign_up = require('../controllers/sign_up')// 注册
const user = require('../controllers/user') // 用户个人中心
const article = require('../controllers/article') // 文章内容页
const subscribe = require('../controllers/subscribe')// 订阅
const article_tag = require('../controllers/article_tag')// 文章标签
const search = require('../controllers/search')// 搜索
const article_list = require('../controllers/article_list')// 编写文章

router.get('/', index.get_index) // 主页 page

router.get('sign_in', sign_in.get_sign_in) // 登录 page
router.get('esc_sign_in', sign_in.esc_sign_in) // 退出登录
router.post('sign_in', sign_in.post_sign_in) // 登录数据 post api

router.get('sign_up', sign_up.get_sign_up) // 注册 page
router.post('sign_up', sign_up.post_sign_up) // 注册数据 post api
router.post('sign_up_code', sign_up.post_sign_up_code) // 注册数据 post api

router.get('user/:uid', user.verify_user, user.get_user) // 用户个人中心页
router.get('user/:uid/topic', user.verify_user, user.get_user_topic) // 用户个人中心页

router.get('subscribe/tag', subscribe.get_subscribe_tag) // 订阅

router.get('article/:aid', article.get_article) // 文章内容页 page

router.get('writer', Check_Session, article.get_writer) // 编写文章 page
router.post('writer', ajaxCheck_Session, article.post_writer) // 编写文章post api

router.get('article_list', article_list) // 文章列表 page


router.get('tag', article_tag.get_tag) // 文章标签

router.get('search', search.get_search) // 搜索

module.exports = router