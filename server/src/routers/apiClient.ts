import express from 'express'
import index from '../controllers/client/index' // 主页
import user from '../controllers/client/user/user' // 注册
import personalCenter from '../controllers/client/user/personalCenter' // 用户个人中心
import article from '../controllers/client/article/article' // 文章内容页
import articleBlog from '../controllers/client/article/articleBlog' // 文章评论
import articleComment from '../controllers/client/article/articleComment' // 文章评论
import subscribe from '../controllers/client/subscribe' // 订阅
import upload from '../controllers/client/upload' // 上传
import website from '../controllers/client/website' // 上传
import dynamic from '../controllers/client/dynamic/dynamic' // 动态
import dynamicComment from '../controllers/client/dynamic/dynamicComment' // 动态评论
import books from '../controllers/client/books/books' // 小书
import book from '../controllers/client/books/book' // 小书章节
import booksComment from '../controllers/client/books/booksComment' // 小书评价
import bookComment from '../controllers/client/books/bookComment' // 小书章节评论
import like from '../controllers/client/like' // 喜欢
import attention from '../controllers/client/attention' // 关注
import thumb from '../controllers/client/thumb' // 赞
import collect from '../controllers/client/collect' // 收藏
import virtual from '../controllers/client/virtual' // 虚拟币
import shop from '../controllers/client/shop' // 购物
import experience from '../controllers/client/experience' // 经验

const tokens = require('../utils/tokens') // 登录tokens
const verifyAuthority = require('../utils/verifyAuthority') // 权限验证
const uploadModel = require('../utils/upload')
const router = express.Router()
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
  articleBlog.createUserArticleBlog
) // 用户文章专题 TYPE:AJAX post

router.post(
  '/personal/update-article-blog',
  tokens.ClientVerifyToken,
  articleBlog.updateUserArticleBlog
) // 更新用户所有文章专题 TYPE:AJAX get

router.post(
  '/personal/delete-article-blog',
  tokens.ClientVerifyToken,
  articleBlog.deleteUserArticleBlog
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

router.post(
  '/personal/upload-avatar',
  tokens.ClientVerifyToken,
  uploadModel('avatarImg').single('file'),
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

router.get('/user/blog-all', articleBlog.getUserArticleBlogAll) // 获取用户所有文章专题 TYPE:AJAX get

router.get('/user/attention-list', personalCenter.getUserAttentionList) // 获取用户个人中心关注列表

router.get('/user/like-article-list', personalCenter.getUserLikeArticleList) // 用户个人中心喜欢

router.get('/user/my-article', personalCenter.userMyArticle) // 用户个人中心专题页

router.get('/user/role-all', user.getUserRoleAll) // 获取所有用户角色标签

/**
 * 文章相关的接口
 */

router.get('/article', tokens.ClientVerifyTokenInfo, article.getArticle) // 根据aid获取文章 get

router.get(
  '/article-annex',
  tokens.ClientVerifyTokenInfo,
  article.getArticleAnnex
) // 根据aid获取文章 get

router.get('/user-article', tokens.ClientVerifyToken, article.getUserArticle) // 根据aid uid获取用户自己的某一篇文章 get

router.post(
  '/article/upload-article-picture',
  tokens.ClientVerifyToken,
  uploadModel('articleImg').single('file'),
  upload.uploadArticlePicture
) // 文章图片上传

router.post(
  '/article-blog/upload-img',
  tokens.ClientVerifyToken,
  uploadModel('articleBlogImg').single('file'),
  upload.uploadArticleBlogPicture
) // 文章图片上传

router.post(
  '/article/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  article.createArticle
) // 编写文章post TYPE:AJAX post

router.get('/article/index', index.getIndexArticle) // 首页文章 get

router.get('/article/index-column', index.getColumnArticle) // 首页专栏文章 get

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

router.get('/article/column-all', article.getArticleColumnAll) // 获取文章专栏

router.get('/article-column/list', article.getArticleColumnList) // 获取文章专栏列表

/**
 * 文章标签相关的接口
 */

router.get('/article-tag', article.getArticleTag) // 文章标签

router.get('/article-tag/all', article.getArticleTagAll) // 获取文章标签 获取全部的

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
 * 个人专栏相关
 */

router.get('/article-blog/info', articleBlog.getArticleBlogView) // 个人专栏详细信息
router.get('/article-blog/article-list', articleBlog.getArticleBlogArticleList) // 当前个人专栏文章列表

router.get(
  '/article-blog/like-list',
  tokens.ClientVerifyToken,
  articleBlog.getLikeArticleBlogList
) // 获取用户个人like的文章列表

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
  uploadModel('dynamic').single('file'),
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

router.get('/personal/dynamic-list', personalCenter.getDynamicListMe) // 个人中心获取列表

router.get('/dynamic-topic/info', dynamic.getDynamicTopicInfo) // 获取动态话题的信息

router.get('/personal/article-blog-list', personalCenter.userArticleBlogList) // 用户自己的个人专栏列表

// 小书
router.post(
  '/books/upload-books-picture',
  tokens.ClientVerifyToken,
  uploadModel('booksImg').single('file'),
  upload.uploadBooksPicture
) // 小书图片上传

// 小书创建
router.post(
  '/books/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  books.createBooks
)

router.get('/personal/books-list', personalCenter.userBooksList) // 获取用户个人小书的列表

router.get('/user-books/info', tokens.ClientVerifyToken, books.getUserBooksInfo) // 获取用户自己的小书信息

router.get('/books/info', tokens.ClientVerifyTokenInfo, books.getBooksInfo) // 获取小书信息

router.get(
  '/books/book-all',
  tokens.ClientVerifyTokenInfo,
  books.getBooksBookAll
) // 获取小书章节列表

router.post('/books/update', tokens.ClientVerifyToken, books.updateBooks) // 更新用户自己的小书

router.post('/books/delete', tokens.ClientVerifyToken, books.deleteBooks) // 删除用户自己的小书

router.get('/books/list', books.getBooksList) // 首页小书的列表

router.post(
  '/book/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  book.createBook
) // 创建小书的章节

router.post('/book/update', tokens.ClientVerifyToken, book.updateBook) // 编辑小书的章节

router.get('/user-book/info', tokens.ClientVerifyToken, book.getUserBookInfo) // 获取用户自己的小书章节信息

router.get('/book/info', tokens.ClientVerifyTokenInfo, book.getBookInfo) // 获取小书章节信息

router.post('/book/next-prev', book.getNextPrevBook) // 获取小书上一页，下一页

router.post('/book/delete', tokens.ClientVerifyToken, book.deleteBook) // 删除用户自己的小书章节

router.post(
  '/book/upload-book-picture',
  tokens.ClientVerifyToken,
  uploadModel('bookImg').single('file'),
  upload.uploadBookPicture
) // 小书章节图片上传

// 小书评论

router.get('/books-comment/list', booksComment.getBooksCommentList) // 获取用户发表小书评论的评论列表 TYPE:AJAX get

router.post(
  '/books-comment/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  booksComment.createBooksComment
) // 用户小书发表评论 TYPE:AJAX post

router.post(
  '/books-comment/delete',
  tokens.ClientVerifyToken,
  booksComment.deleteBooksComment
) // 删除小书评论 TYPE:AJAX post

// 小书章节评论

router.get('/book-comment/list', bookComment.getBookCommentList) // 获取用户发表小书章节评论的评论列表 TYPE:AJAX get

router.post(
  '/book-comment/create',
  tokens.ClientVerifyToken,
  verifyAuthority.ClientCheck,
  bookComment.createBookComment
) // 用户小书章节评论发表评论 TYPE:AJAX post

router.post(
  '/book-comment/delete',
  tokens.ClientVerifyToken,
  bookComment.deleteBookComment
) // 删除小书章节评论 TYPE:AJAX post

router.get(
  '/collect/books-list',
  tokens.ClientVerifyToken,
  books.getCollectBooksList
) // 收藏小书

// 用户虚拟币开始 2019.11.4 0:19

// 签到
router.post('/virtual/check-in', tokens.ClientVerifyToken, virtual.checkIn)
// 虚拟币动态记录
router.get('/virtual/list', tokens.ClientVerifyToken, virtual.getVirtualList)

// 购买

router.post('/shop/buy', tokens.ClientVerifyToken, shop.Buy)
// 订单列表
router.get('/shop/list', tokens.ClientVerifyToken, shop.orderList)

// 获取用户关联信息
router.get(
  '/user/associate-info',
  tokens.ClientVerifyTokenInfo,
  user.getUserAssociateinfo
)

// 关注类

router.post(
  '/common/attention',
  tokens.ClientVerifyToken,
  attention.setAttention
)

router.post('/common/like', tokens.ClientVerifyToken, like.setLike) // like TYPE:AJAX post

router.post('/common/collect', tokens.ClientVerifyToken, collect.setCollect) // 收藏

router.post('/common/thumb', tokens.ClientVerifyToken, thumb.setThumb) // 用户点赞动态TYPE:AJAX post

router.get(
  '/experience/list',
  tokens.ClientVerifyToken,
  experience.getExperienceList
) // 获取经验列表

module.exports = router
