const router = require('koa-router')()
const index = require('../controllers/client/index') // 主页
const user = require('../controllers/client/user') // 注册
const personalCenter = require('../controllers/client/personalCenter') // 用户个人中心
const article = require('../controllers/client/article') // 文章内容页
const subscribe = require('../controllers/client/subscribe') // 订阅
const userArticleBlog = require('../controllers/client/userArticleBlog') // 用户文章专题
const articleComment = require('../controllers/client/articleComment') // 文章评论
const upload = require('../controllers/client/upload') // 上传
const website = require('../controllers/client/website') // 上传
const tokens = require('../utils/tokens') // 登录tokens
const verifyAuthority = require('../utils/verifyAuthority') // 权限验证
const dynamic = require('../controllers/client/dynamic') // 动态
const dynamicComment = require('../controllers/client/dynamicComment') // 动态评论
/**
 * 获取标签列表操作
 * @param   {String} TYPE 当前router 作用类型 AJAX:ajax传递数据 RENDER:render渲染页面或者 post form提交数据
 */

/* AJAX */
/* 登录类 注册类 */
router.post('/sign-in', user.userSignIn) // 登录数据 post TYPE:RENDER

router.post('/sign-up', user.userSignUp) // 注册数据 post TYPE:AJAX post

router.post('/sign-up-code', user.userSignUpCode) // 注册数据  发送注册 验证码 post TYPE:AJAX post

router.post('/reset-password-code', user.sendResetPasswordCode) // 重置密码验证码发送 TYPE:AJAX post

router.post('/reset_password', user.userResetPassword) // 重置密码 TYPE:AJAX post

/**
 * 个人信息类
 */

router.post('/personal/info', tokens.ClientVerifyToken, user.userPersonalInfo)

router.post(
  '/personal/create-article-blog',
  tokens.ClientVerifyToken,
  userArticleBlog.createUserArticleBlog
) // 用户文章专题 TYPE:AJAX post

router.post(
  '/personal/update-article-blog',
  tokens.ClientVerifyToken,
  userArticleBlog.updateUserArticleBlog
) // 更新用户所有文章专题 TYPE:AJAX get

router.post(
  '/personal/delete-article-blog',
  tokens.ClientVerifyToken,
  userArticleBlog.deleteUserArticleBlog
) // 删除用户所有文章专题 TYPE:AJAX get

router.get(
  '/personal/message-list',
  tokens.ClientVerifyToken,
  user.getUserMessageList
) // 用户消息 TYPE:AJAX get

router.delete(
  '/personal/message-delete',
  tokens.ClientVerifyToken,
  user.deleteUserMessage
) // 删除用户消息 TYPE:AJAX post

router.get(
  '/personal/unread-message-count',
  tokens.ClientVerifyToken,
  user.getUnreadMessageCount
) // 获取未读用户消息数量 TYPE:AJAX get

router.post(
  '/personal/upload-avatar',
  tokens.ClientVerifyToken,
  upload.uploadUserAvatar
) // 用户修改头像 post

router.put(
  '/personal/update-info',
  tokens.ClientVerifyToken,
  user.updateUserInfo
) // 根据uid 更新用户相应信息 post

router.put(
  '/personal/update-password',
  tokens.ClientVerifyToken,
  user.updateUserPassword
) // 根据uid 更新用户登录密码

/**
 * 用户信息类
 */
router.get('/user/info', user.getUserInfo) // 根据uid 获取用户相应信息 get

router.get('/user/blog-all', userArticleBlog.getUserArticleBlogAll) // 获取用户所有文章专题 TYPE:AJAX get

router.post(
  '/user/attention',
  tokens.ClientVerifyToken,
  personalCenter.setUserAttention
) // 用户关注用户 TYPE:AJAX post

router.get('/user/attention-list', personalCenter.getUserAttentionList) // 获取用户个人中心关注列表

router.post(
  '/user/like-article',
  tokens.ClientVerifyToken,
  personalCenter.setUserLikeArticle
) // 用户like文章 TYPE:AJAX post

router.get('/user/like-article-list', personalCenter.getUserLikeArticleList) // 用户个人中心喜欢

router.get('/user/my-article', personalCenter.userMyArticle) // 用户个人中心专题页

router.get('/user/role-all', user.getUserRoleAll) // 获取所有用户角色标签

/**
 * 文章相关的接口
 */

router.get('/article', article.getArticle) // 根据aid获取文章 get

router.get('/user-article', tokens.ClientVerifyToken, article.getUserArticle) // 根据aid uid获取用户自己的某一篇文章 get

router.post(
  '/article/upload-article-picture',
  tokens.ClientVerifyToken,
  upload.uploadArticlePicture
) // 文章图片上传

router.post(
  '/article/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  article.createArticle
) // 编写文章post TYPE:AJAX post

router.get('/article/index', index.getIndex) // 首页文章 get

router.put('/article/update', tokens.ClientVerifyToken, article.updateArticle) // 更新文章

router.delete(
  '/article/delete',
  tokens.ClientVerifyToken,
  article.deleteArticle
) // 删除文章 delete

router.get('/article/search', article.searchArticle) // 搜索

/**
 * 文章专栏相关的接口
 */

router.get('/article/column', article.getArticleColumn) // 获取文章专栏

router.get('/article-column/list', article.getArticleColumnList) // 获取文章专栏列表

/**
 * 文章标签相关的接口
 */

router.get('/article-tag', article.getArticleTag) // 文章标签

router.get('/article-tag/all', article.getArticleTagAll) // 获取文章标签 获取全部的

router.post(
  '/subscribe/tag',
  tokens.ClientVerifyToken,
  subscribe.setSubscribeTag
) // 用户订阅标签 TYPE:AJAX post

router.get('/article-tag/list', subscribe.getArticleTagList) // 获取用户订阅标签列表 根据搜索和分页获取

router.get('/article-tag/popular-list', article.getPopularArticleTag) // 获取热门文章标签

router.get(
  '/article-tag/list-my',
  tokens.ClientVerifyToken,
  subscribe.getArticleTagListMy
) // 获取用户已订阅的

router.get(
  '/subscribe/tag-my',
  tokens.ClientVerifyToken,
  subscribe.getSubscribeTagMyAll
) // 获取文章标签 获取全部的

/**
 * 文章评论相关
 */

router.get('/article/comment-list', articleComment.getArticleComment) // 获取用户发表的评论列表 TYPE:AJAX get

router.post(
  '/article/comment-create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  articleComment.createArticleComment
) // 用户发表评论 TYPE:AJAX post

router.post(
  '/article/comment-delete',
  tokens.ClientVerifyToken,
  articleComment.deleteArticleComment
) // 删除评论 TYPE:AJAX post

/**
 * 网站配置相关信息
 */

router.post(
  '/dynamic/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  dynamic.createDynamic
) // 创建动态

router.get('/dynamic/list', dynamic.getDynamicList) // 获取动态列表

router.get('/dynamic/recommend-list', dynamic.recommendDynamicList) // 获取推荐动态列表

router.get(
  '/dynamic/list-my',
  tokens.ClientVerifyToken,
  dynamic.getDynamicListMe
) // 获取我的动态或者关注列表

router.get('/dynamic/view', dynamic.getDynamicView) // 获取动态详情

router.post(
  '/dynamic/upload-dynamic-picture',
  tokens.ClientVerifyToken,
  upload.uploadDynamicPicture
) // 动态图片上传

router.delete(
  '/dynamic/delete',
  tokens.ClientVerifyToken,
  dynamic.deleteDynamic
) // 删除动态 TYPE:AJAX post

router.get('/website/info', website.getWebsiteInfo) // 网站配置相关信息 TYPE:AJAX get

router.get('/dynamic-topic/index', dynamic.dynamicTopicIndex) // 获取首页专题 TYPE:AJAX post

router.get('/dynamic-topic/list', dynamic.dynamicTopicList) // 获取专题页专题

/**
 * 动态评论相关
 */

router.get('/dynamic-comment/list', dynamicComment.getDynamicCommentList) // 获取用户发表的动态评论列表 TYPE:AJAX get

router.get('/dynamic-comment/all', dynamicComment.getDynamicCommentAll) // 获取用户发表的动态评论全部 TYPE:AJAX get

router.post(
  '/dynamic-comment/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  dynamicComment.createDynamicComment
) // 用户发表动态评论 TYPE:AJAX post

router.post(
  '/dynamic-comment/delete',
  tokens.ClientVerifyToken,
  dynamicComment.deleteDynamicComment
) // 删除动态评论 TYPE:AJAX post

router.post(
  '/user/like-dynamic',
  tokens.ClientVerifyToken,
  personalCenter.setUserLikeDynamic
) // 用户like动态TYPE:AJAX post

router.post(
  '/subscribe/dynamic_topic',
  tokens.ClientVerifyToken,
  subscribe.setSubscribeDynamicTopic
) // 用户订阅话题 TYPE:AJAX post

router.get('/personal/dynamic-list', personalCenter.getDynamicListMe) // 个人中心获取列表

module.exports = router
