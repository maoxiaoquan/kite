const router = require('koa-router')()
const {Check_Session, ajaxCheck_Session} = require('../utils/check_session')
const index = require('../controllers/index')// 主页
const user = require('../controllers/user')// 注册
const personal_center = require('../controllers/personal_center') // 用户个人中心
const article = require('../controllers/article') // 文章内容页
const subscribe = require('../controllers/subscribe')// 订阅
const user_article_topic = require('../controllers/user_article_topic')// 用户文章专题
const search = require('../controllers/search')// 搜索

/**
 * 获取标签列表操作
 * @param   {String} TYPE 当前router 作用类型 AJAX:ajax传递数据 RENDER:render渲染页面或者 post form提交数据
 */

/*PAGE RENDER*/

router.get('/', index.render_get_index) // 主页 page

router.get('column/:column_id', index.render_get_index) // 文章内容页 page

router.get('sign_in', user.render_sign_in) // 登录 page

router.get('sign_up', user.render_sign_up) // 注册 page

router.get('user/:uid/article/:topic_id', personal_center.verify_user, personal_center.render_user_center_article) // 用户个人中心专题页

router.get('user/:uid/topic', personal_center.verify_user, personal_center.render_user_center_topic) // 用户个人中心专题页

router.get('user/:uid/attention', personal_center.verify_user, personal_center.render_user_center_attention) // 用户个人中心关注

router.get('user/:uid/like', personal_center.verify_user, personal_center.render_user_center_like) // 用户个人中心喜欢

router.get('subscribe/tag', subscribe.render_subscribe_tag) // 订阅

router.get('tag/:article_tag_id', article.render_get_tag) // 文章标签

router.get('daily_recommend', article.render_article_daily_recommend) // 文章的每日推荐

router.get('article/:aid', article.render_article) // 文章内容页 page

router.get('writer', Check_Session, article.render_writer) // 编写文章 page

router.get('404', index.no_found_404) // 编写文章 page

router.get('esc_sign_in', user.esc_sign_in) // 退出登录

/*FORM*/

router.post('sign_in', user.form_sign_in) // 登录数据 post TYPE:RENDER

router.get('search', search.form_search) // 搜索

/*AJAX*/

router.get('get_index_article', index.get_index)

router.post('sign_up', user.post_sign_up) // 注册数据 post TYPE:AJAX

router.post('sign_up_code', user.post_sign_up_code) // 注册数据 post TYPE:AJAX

router.post('article_writer', ajaxCheck_Session, article.post_create_writer) // 编写文章post TYPE:AJAX

router.get('get_article_tag_all', ajaxCheck_Session, article.get_article_tag_all) // 获取所有文章标签 TYPE:AJAX

router.get('get_article_topic_all', ajaxCheck_Session, user_article_topic.get_user_article_topic_all) // 获取用户所有文章专题 TYPE:AJAX

router.post('post_user_attention', ajaxCheck_Session, personal_center.post_user_attention) // 用户关注用户 TYPE:AJAX

router.post('post_subscribe_tag', ajaxCheck_Session, subscribe.post_subscribe_tag) // 用户订阅标签 TYPE:AJAX

router.post('create_user_article_topic', ajaxCheck_Session, user_article_topic.create_user_article_topic) // 用户文章专题 TYPE:AJAX

module.exports = router