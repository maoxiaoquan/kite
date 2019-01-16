const router = require('koa-router')()
const { Check_Session, ajaxCheck_Session } = require('../utils/check_session')
const index = require('../controllers/client/index')// 主页
const user = require('../controllers/client/user')// 注册
const personal_center = require('../controllers/client/personal_center') // 用户个人中心
const article = require('../controllers/client/article') // 文章内容页
const subscribe = require('../controllers/client/subscribe')// 订阅
const user_article_topic = require('../controllers/client/user_article_topic')// 用户文章专题
const banner = require('../controllers/client/banner')// banner
const comment = require('../controllers/client/comment')// 评论
const upload = require('../controllers/client/upload')// 上传
const tokens = require('../utils/tokens') // 登录tokens

/* 工具类 */
const util_upload = require('../utils/upload') // 上传工具类
/**
 * 获取标签列表操作
 * @param   {String} TYPE 当前router 作用类型 AJAX:ajax传递数据 RENDER:render渲染页面或者 post form提交数据
 */

/* PAGE RENDER */

router.get('user/:uid/article/:topic_id', personal_center.verify_user, personal_center.render_user_center_article) // 用户个人中心专题页

router.get('user/:uid/attention', personal_center.verify_user, personal_center.render_user_center_attention) // 用户个人中心关注

router.get('user/:uid/like', personal_center.verify_user, personal_center.render_user_center_like) // 用户个人中心喜欢

router.get('user/:uid/message', personal_center.verify_user, personal_center.render_user_center_message) // 用户个人中心动态

router.get('subscribe/tag', subscribe.render_subscribe_tag) // 订阅

router.get('tag/:article_tag_id', article.render_get_tag) // 文章标签

router.get('article/:aid', article.render_article) // 文章内容页 page

router.get('user/settings/profile', Check_Session, user.render_user_settings_profile) // 个人设置 资料

router.get('user/settings/password', Check_Session, user.render_user_settings_password) // 个人设置 密码修改

router.get('writer', Check_Session, article.render_writer) // 编写文章 page

router.get('404', index.no_found_404) // 编写文章 page

router.get('esc_sign_in', user.esc_sign_in) // 退出登录

router.get('reset_password', user.render_reset_password) // 重置密码

/* FORM */

router.get('search', article.form_search_article) // 搜索

/* AJAX */
/* 登录类 注册类 */
router.post('/sign_in', user.post_sign_in) // 登录数据 post TYPE:RENDER

router.post('/sign_up', user.post_sign_up) // 注册数据 post TYPE:AJAX post

router.post('/sign_up_code', user.post_sign_up_code) // 注册数据  发送注册 验证码 post TYPE:AJAX post

/**
 * 个人信息类 需登录鉴权的接口
 */

router.post('/personal/info', tokens.ClientVerifyToken, user.personal_info)

router.post('/personal/create_article_topic', tokens.ClientVerifyToken, user_article_topic.create_user_article_topic) // 用户文章专题 TYPE:AJAX post

/**
 * 用户信息类 无需登录鉴权的接口
 */
router.get('/user/info', user.get_user_info) // 根据uid 获取用户相应信息 get

router.get('/user/topic_all', user_article_topic.get_user_article_topic_all) // 获取用户所有文章专题 TYPE:AJAX get

/**
 * 文章相关的接口
 */

router.post('/article/upload_article_picture', tokens.ClientVerifyToken, util_upload('article_picture')
  .single('file'), upload.upload_article_picture) // 文章图片上传

router.post('/article/create', tokens.ClientVerifyToken, article.post_create_writer) // 编写文章post TYPE:AJAX post

router.get('/index_article', index.get_index) // 首页文章 get

router.get('/article', article.get_article) // 根据aid获取文章 get

router.get('/article/column', article.get_article_column) // 获取文章专栏

router.get('/article/tag', article.get_article_tag_all) // 获取文章标签

router.get('/home_banner', banner.get_home_banner) // 获取首页头部 banner

router.post('/upload_user_avatar', ajaxCheck_Session, util_upload('user_avatar')
  .single('file'), upload.upload_user_avatar) // 用户修改头像 post

router.post('/update_user_info', ajaxCheck_Session, user.post_update_user_info) // 根据uid 更新用户相应信息 post

router.post('/update_user_password', ajaxCheck_Session, user.post_update_user_password) // 根据uid 更新用户登录密码


router.get('/get_article_tag_all', ajaxCheck_Session, article.get_article_tag_all) // 获取所有文章标签 TYPE:AJAX get

router.post('/update_user_article_topic', ajaxCheck_Session, user_article_topic.update_user_article_topic) // 更新用户所有文章专题 TYPE:AJAX get

router.post('/delete_user_article_topic', ajaxCheck_Session, user_article_topic.delete_user_article_topic) // 删除用户所有文章专题 TYPE:AJAX get

router.post('/post_user_attention', ajaxCheck_Session, personal_center.post_user_attention) // 用户关注用户 TYPE:AJAX post

router.post('/post_subscribe_tag', ajaxCheck_Session, subscribe.post_subscribe_tag) // 用户订阅标签 TYPE:AJAX post

router.post('/user_like_article', ajaxCheck_Session, personal_center.post_user_like_article) // 用户like文章 TYPE:AJAX post


router.get('/get_comment', comment.get_comment) // 获取用户发表的评论 TYPE:AJAX get

router.post('/create_comment', ajaxCheck_Session, comment.post_create_comment) // 用户发表评论 TYPE:AJAX post

router.post('/delete_comment', ajaxCheck_Session, comment.post_delete_comment) // 删除评论 TYPE:AJAX post

router.get('/unread_message_count', ajaxCheck_Session, user.get_unread_message_count) // 获取未读用户消息数量 TYPE:AJAX get

router.get('/user_message', ajaxCheck_Session, user.get_user_message) // 用户消息 TYPE:AJAX get

router.post('/delete_user_message', ajaxCheck_Session, user.post_delete_user_message) // 删除用户消息 TYPE:AJAX post

router.post('/reset_password_code', user.post_reset_password_code) // 重置密码验证码发送 TYPE:AJAX post

router.post('/reset_password', user.post_reset_password) // 重置密码 TYPE:AJAX post

router.get('/user_tag_all', user.get_user_tag_all) // 获取所有用户角色标签

module.exports = router