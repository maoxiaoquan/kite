const router = require('koa-router')()
const index = require('../controllers/client/index') // 主页
const user = require('../controllers/client/user') // 注册
const personalCenter = require('../controllers/client/personalCenter') // 用户个人中心
const article = require('../controllers/client/article') // 文章内容页
const subscribe = require('../controllers/client/subscribe') // 订阅
const userArticleTopic = require('../controllers/client/userArticleTopic') // 用户文章专题
const comment = require('../controllers/client/comment') // 评论
const upload = require('../controllers/client/upload') // 上传
const website = require('../controllers/client/website') // 上传
const tokens = require('../utils/tokens') // 登录tokens
const verifyAuthority = require('../utils/verifyAuthority') // 权限验证

/**
 * 获取标签列表操作
 * @param   {String} TYPE 当前router 作用类型 AJAX:ajax传递数据 RENDER:render渲染页面或者 post form提交数据
 */

/* AJAX */
/* 登录类 注册类 */
router.post('/sign_in', user.post_sign_in) // 登录数据 post TYPE:RENDER

router.post('/sign_up', user.post_sign_up) // 注册数据 post TYPE:AJAX post

router.post('/sign_up_code', user.post_sign_up_code) // 注册数据  发送注册 验证码 post TYPE:AJAX post

router.post('/reset_password_code', user.post_reset_password_code) // 重置密码验证码发送 TYPE:AJAX post

router.post('/reset_password', user.post_reset_password) // 重置密码 TYPE:AJAX post

/**
 * 个人信息类
 */

router.post('/personal/info', tokens.ClientVerifyToken, user.personal_info)

router.post(
  '/personal/create_article_topic',
  tokens.ClientVerifyToken,
  userArticleTopic.create_user_article_topic
) // 用户文章专题 TYPE:AJAX post

router.post(
  '/personal/update-article-topic',
  tokens.ClientVerifyToken,
  userArticleTopic.update_user_article_topic
) // 更新用户所有文章专题 TYPE:AJAX get

router.post(
  '/personal/delete-article-topic',
  tokens.ClientVerifyToken,
  userArticleTopic.delete_user_article_topic
) // 删除用户所有文章专题 TYPE:AJAX get

router.get(
  '/personal/message-list',
  tokens.ClientVerifyToken,
  user.get_user_message
) // 用户消息 TYPE:AJAX get

router.delete(
  '/personal/message-delete',
  tokens.ClientVerifyToken,
  user.post_delete_user_message
) // 删除用户消息 TYPE:AJAX post

router.get(
  '/personal/unread-message-count',
  tokens.ClientVerifyToken,
  user.get_unread_message_count
) // 获取未读用户消息数量 TYPE:AJAX get

router.post(
  '/personal/upload-avatar',
  tokens.ClientVerifyToken,
  upload.upload_user_avatar
) // 用户修改头像 post

router.put(
  '/personal/update-info',
  tokens.ClientVerifyToken,
  user.post_update_user_info
) // 根据uid 更新用户相应信息 post

router.put(
  '/personal/update-password',
  tokens.ClientVerifyToken,
  user.post_update_user_password
) // 根据uid 更新用户登录密码

/**
 * 用户信息类
 */
router.get('/user/info', user.get_user_info) // 根据uid 获取用户相应信息 get

router.get('/user/topic-all', userArticleTopic.get_user_article_topic_all) // 获取用户所有文章专题 TYPE:AJAX get

router.post(
  '/user/attention',
  tokens.ClientVerifyToken,
  personalCenter.post_user_attention
) // 用户关注用户 TYPE:AJAX post

router.get('/user/attention-list', personalCenter.user_center_attention) // 获取用户个人中心关注列表

router.post(
  '/user/like-article',
  tokens.ClientVerifyToken,
  personalCenter.post_user_like_article
) // 用户like文章 TYPE:AJAX post

router.get('/user/like-article-list', personalCenter.user_center_like) // 用户个人中心喜欢

router.get('/user/my-article', personalCenter.user_center_article) // 用户个人中心专题页

router.get('/user/role-all', user.getUserRoleAll) // 获取所有用户角色标签

/**
 * 文章相关的接口
 */

router.get('/article', article.get_article) // 根据aid获取文章 get

router.get('/user-article', tokens.ClientVerifyToken, article.getUserArticle) // 根据aid uid获取用户自己的某一篇文章 get

router.post(
  '/article/upload_article_picture',
  tokens.ClientVerifyToken,
  upload.upload_article_picture
) // 文章图片上传

router.post(
  '/article/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  article.post_create_writer
) // 编写文章post TYPE:AJAX post

router.get('/article/index', index.get_index) // 首页文章 get

router.put('/article/update', tokens.ClientVerifyToken, article.update_article) // 更新文章

router.delete(
  '/article/delete',
  tokens.ClientVerifyToken,
  article.deleteArticle
) // 删除文章 delete

router.get('/article/search', article.search_article) // 搜索

/**
 * 文章专栏相关的接口
 */

router.get('/article/column', article.get_article_column) // 获取文章专栏

router.get('/article-column/list', article.getArticleColumnList) // 获取文章专栏列表

/**
 * 文章标签相关的接口
 */

router.get('/article-tag', article.get_article_tag) // 文章标签

router.get('/article-tag/all', article.getArticleTagAll) // 获取文章标签 获取全部的

router.post(
  '/subscribe/tag',
  tokens.ClientVerifyToken,
  subscribe.post_subscribe_tag
) // 用户订阅标签 TYPE:AJAX post

router.get('/article-tag/list', subscribe.getArticleTagList) // 获取用户订阅标签列表 根据搜索和分页获取

router.get('/article-tag/popular-list', article.get_popular_article_tag) // 获取热门文章标签

router.get(
  '/article-tag/list-my',
  tokens.ClientVerifyToken,
  subscribe.get_article_tag_list_my
) // 获取用户已订阅的

router.get(
  '/subscribe/tag-my',
  tokens.ClientVerifyToken,
  subscribe.get_subscribe_tag_my
) // 获取文章标签 获取全部的

/**
 * 文章评论相关
 */

router.get('/article/comment-list', comment.get_comment) // 获取用户发表的评论 TYPE:AJAX get

router.post(
  '/article/comment-create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  comment.post_create_comment
) // 用户发表评论 TYPE:AJAX post

router.post(
  '/article/comment-delete',
  tokens.ClientVerifyToken,
  comment.post_delete_comment
) // 删除评论 TYPE:AJAX post

/**
 * 网站配置相关信息
 */

router.get('/website/info', website.getWebsiteInfo) // 网站配置相关信息 TYPE:AJAX get

module.exports = router
