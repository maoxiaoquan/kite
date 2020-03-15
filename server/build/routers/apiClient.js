"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../controllers/client/index")); // 主页
const user_1 = __importDefault(require("../controllers/client/user/user")); // 注册
const personalCenter_1 = __importDefault(require("../controllers/client/user/personalCenter")); // 用户个人中心
const article_1 = __importDefault(require("../controllers/client/article/article")); // 文章内容页
const articleBlog_1 = __importDefault(require("../controllers/client/article/articleBlog")); // 文章评论
const articleComment_1 = __importDefault(require("../controllers/client/article/articleComment")); // 文章评论
const subscribe_1 = __importDefault(require("../controllers/client/subscribe")); // 订阅
const upload_1 = __importDefault(require("../controllers/client/upload")); // 上传
const website_1 = __importDefault(require("../controllers/client/website")); // 上传
const dynamic_1 = __importDefault(require("../controllers/client/dynamic/dynamic")); // 动态
const dynamicComment_1 = __importDefault(require("../controllers/client/dynamic/dynamicComment")); // 动态评论
const books_1 = __importDefault(require("../controllers/client/books/books")); // 小书
const book_1 = __importDefault(require("../controllers/client/books/book")); // 小书章节
const booksComment_1 = __importDefault(require("../controllers/client/books/booksComment")); // 小书评价
const bookComment_1 = __importDefault(require("../controllers/client/books/bookComment")); // 小书章节评论
const like_1 = __importDefault(require("../controllers/client/like")); // 喜欢
const attention_1 = __importDefault(require("../controllers/client/attention")); // 关注
const thumb_1 = __importDefault(require("../controllers/client/thumb")); // 赞
const collect_1 = __importDefault(require("../controllers/client/collect")); // 收藏
const virtual_1 = __importDefault(require("../controllers/client/virtual")); // 虚拟币
const shop_1 = __importDefault(require("../controllers/client/shop")); // 购物
const experience_1 = __importDefault(require("../controllers/client/experience")); // 经验
const tokens = require('../utils/tokens'); // 登录tokens
const verifyAuthority = require('../utils/verifyAuthority'); // 权限验证
const uploadModel = require('../utils/upload');
const router = express_1.default.Router();
/**
 * 获取标签列表操作
 * @param   {String} TYPE 当前router 作用类型 AJAX:ajax传递数据 RENDER:render渲染页面或者 post form提交数据
 */
/* AJAX */
/* 登录类 注册类 */
router.post('/sign-in', user_1.default.userSignIn); // 登录数据 post TYPE:RENDER
router.post('/sign-up', user_1.default.userSignUp); // 注册数据 post TYPE:AJAX post
router.post('/sign-up-code', user_1.default.userSignUpCode); // 注册数据  发送注册 验证码 post TYPE:AJAX post
router.post('/reset-password-code', user_1.default.sendResetPasswordCode); // 重置密码验证码发送 TYPE:AJAX post
router.post('/reset_password', user_1.default.userResetPassword); // 重置密码 TYPE:AJAX post
/**
 * 个人信息类
 */
router.post('/personal/info', tokens.ClientVerifyToken, user_1.default.userPersonalInfo);
router.post('/personal/create-article-blog', tokens.ClientVerifyToken, articleBlog_1.default.createUserArticleBlog); // 用户文章专题 TYPE:AJAX post
router.post('/personal/update-article-blog', tokens.ClientVerifyToken, articleBlog_1.default.updateUserArticleBlog); // 更新用户所有文章专题 TYPE:AJAX get
router.post('/personal/delete-article-blog', tokens.ClientVerifyToken, articleBlog_1.default.deleteUserArticleBlog); // 删除用户所有文章专题 TYPE:AJAX get
router.get('/personal/message-list', tokens.ClientVerifyToken, user_1.default.getUserMessageList); // 用户消息 TYPE:AJAX get
router.delete('/personal/message-delete', tokens.ClientVerifyToken, user_1.default.deleteUserMessage); // 删除用户消息 TYPE:AJAX post
router.post('/personal/upload-avatar', tokens.ClientVerifyToken, uploadModel('avatarImg').single('file'), upload_1.default.uploadUserAvatar); // 用户修改头像 post
router.put('/personal/update-info', tokens.ClientVerifyToken, user_1.default.updateUserInfo); // 根据uid 更新用户相应信息 post
router.put('/personal/update-password', tokens.ClientVerifyToken, user_1.default.updateUserPassword); // 根据uid 更新用户登录密码
/**
 * 用户信息类
 */
router.get('/user/info', user_1.default.getUserInfo); // 根据uid 获取用户相应信息 get
router.get('/user/blog-all', articleBlog_1.default.getUserArticleBlogAll); // 获取用户所有文章专题 TYPE:AJAX get
router.get('/user/attention-list', personalCenter_1.default.getUserAttentionList); // 获取用户个人中心关注列表
router.get('/user/like-article-list', personalCenter_1.default.getUserLikeArticleList); // 用户个人中心喜欢
router.get('/user/my-article', personalCenter_1.default.userMyArticle); // 用户个人中心专题页
router.get('/user/role-all', user_1.default.getUserRoleAll); // 获取所有用户角色标签
/**
 * 文章相关的接口
 */
router.get('/article', tokens.ClientVerifyTokenInfo, article_1.default.getArticle); // 根据aid获取文章 get
router.get('/article-annex', tokens.ClientVerifyTokenInfo, article_1.default.getArticleAnnex); // 根据aid获取文章 get
router.get('/user-article', tokens.ClientVerifyToken, article_1.default.getUserArticle); // 根据aid uid获取用户自己的某一篇文章 get
router.post('/article/upload-article-picture', tokens.ClientVerifyToken, uploadModel('articleImg').single('file'), upload_1.default.uploadArticlePicture); // 文章图片上传
router.post('/article-blog/upload-img', tokens.ClientVerifyToken, uploadModel('articleBlogImg').single('file'), upload_1.default.uploadArticleBlogPicture); // 文章图片上传
router.post('/article/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, article_1.default.createArticle); // 编写文章post TYPE:AJAX post
router.get('/article/index', index_1.default.getIndexArticle); // 首页文章 get
router.get('/article/index-column', index_1.default.getColumnArticle); // 首页专栏文章 get
router.put('/article/update', tokens.ClientVerifyToken, article_1.default.updateArticle); // 更新文章
router.delete('/article/delete', tokens.ClientVerifyToken, article_1.default.deleteArticle); // 删除文章 delete
router.get('/article/search', article_1.default.searchArticle); // 搜索
/**
 * 文章专栏相关的接口
 */
router.get('/article/column', article_1.default.getArticleColumn); // 获取文章专栏
router.get('/article/column-all', article_1.default.getArticleColumnAll); // 获取文章专栏
router.get('/article-column/list', article_1.default.getArticleColumnList); // 获取文章专栏列表
/**
 * 文章标签相关的接口
 */
router.get('/article-tag', article_1.default.getArticleTag); // 文章标签
router.get('/article-tag/all', article_1.default.getArticleTagAll); // 获取文章标签 获取全部的
router.get('/article-tag/list', subscribe_1.default.getArticleTagList); // 获取用户订阅标签列表 根据搜索和分页获取
router.get('/article-tag/popular-list', article_1.default.getPopularArticleTag); // 获取热门文章标签
router.get('/article-tag/list-my', tokens.ClientVerifyToken, subscribe_1.default.getArticleTagListMy); // 获取用户已订阅的
router.get('/subscribe/tag-my', tokens.ClientVerifyToken, subscribe_1.default.getSubscribeTagMyAll); // 获取文章标签 获取全部的
/**
 * 个人专栏相关
 */
router.get('/article-blog/info', articleBlog_1.default.getArticleBlogView); // 个人专栏详细信息
router.get('/article-blog/article-list', articleBlog_1.default.getArticleBlogArticleList); // 当前个人专栏文章列表
router.get('/article-blog/like-list', tokens.ClientVerifyToken, articleBlog_1.default.getLikeArticleBlogList); // 获取用户个人like的文章列表
/**
 * 文章评论相关
 */
router.get('/article/comment-list', articleComment_1.default.getArticleComment); // 获取用户发表的评论列表 TYPE:AJAX get
router.post('/article/comment-create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, articleComment_1.default.createArticleComment); // 用户发表评论 TYPE:AJAX post
router.post('/article/comment-delete', tokens.ClientVerifyToken, articleComment_1.default.deleteArticleComment); // 删除评论 TYPE:AJAX post
/**
 * 网站配置相关信息
 */
router.post('/dynamic/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, dynamic_1.default.createDynamic); // 创建动态
router.get('/dynamic/list', dynamic_1.default.getDynamicList); // 获取动态列表
router.get('/dynamic/recommend-list', dynamic_1.default.recommendDynamicList); // 获取推荐动态列表
router.get('/dynamic/list-my', tokens.ClientVerifyToken, dynamic_1.default.getDynamicListMe); // 获取我的动态或者关注列表
router.get('/dynamic/view', dynamic_1.default.getDynamicView); // 获取动态详情
router.post('/dynamic/upload-dynamic-picture', tokens.ClientVerifyToken, uploadModel('dynamic').single('file'), upload_1.default.uploadDynamicPicture); // 动态图片上传
router.delete('/dynamic/delete', tokens.ClientVerifyToken, dynamic_1.default.deleteDynamic); // 删除动态 TYPE:AJAX post
router.get('/website/info', website_1.default.getWebsiteInfo); // 网站配置相关信息 TYPE:AJAX get
router.get('/dynamic-topic/index', dynamic_1.default.dynamicTopicIndex); // 获取首页专题 TYPE:AJAX post
router.get('/dynamic-topic/list', dynamic_1.default.dynamicTopicList); // 获取专题页专题
/**
 * 动态评论相关
 */
router.get('/dynamic-comment/list', dynamicComment_1.default.getDynamicCommentList); // 获取用户发表的动态评论列表 TYPE:AJAX get
router.get('/dynamic-comment/all', dynamicComment_1.default.getDynamicCommentAll); // 获取用户发表的动态评论全部 TYPE:AJAX get
router.post('/dynamic-comment/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, dynamicComment_1.default.createDynamicComment); // 用户发表动态评论 TYPE:AJAX post
router.post('/dynamic-comment/delete', tokens.ClientVerifyToken, dynamicComment_1.default.deleteDynamicComment); // 删除动态评论 TYPE:AJAX post
router.get('/personal/dynamic-list', personalCenter_1.default.getDynamicListMe); // 个人中心获取列表
router.get('/dynamic-topic/info', dynamic_1.default.getDynamicTopicInfo); // 获取动态话题的信息
router.get('/personal/article-blog-list', personalCenter_1.default.userArticleBlogList); // 用户自己的个人专栏列表
// 小书
router.post('/books/upload-books-picture', tokens.ClientVerifyToken, uploadModel('booksImg').single('file'), upload_1.default.uploadBooksPicture); // 小书图片上传
// 小书创建
router.post('/books/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, books_1.default.createBooks);
router.get('/personal/books-list', personalCenter_1.default.userBooksList); // 获取用户个人小书的列表
router.get('/user-books/info', tokens.ClientVerifyToken, books_1.default.getUserBooksInfo); // 获取用户自己的小书信息
router.get('/books/info', tokens.ClientVerifyTokenInfo, books_1.default.getBooksInfo); // 获取小书信息
router.get('/books/book-all', tokens.ClientVerifyTokenInfo, books_1.default.getBooksBookAll); // 获取小书章节列表
router.post('/books/update', tokens.ClientVerifyToken, books_1.default.updateBooks); // 更新用户自己的小书
router.post('/books/delete', tokens.ClientVerifyToken, books_1.default.deleteBooks); // 删除用户自己的小书
router.get('/books/list', books_1.default.getBooksList); // 首页小书的列表
router.post('/book/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, book_1.default.createBook); // 创建小书的章节
router.post('/book/update', tokens.ClientVerifyToken, book_1.default.updateBook); // 编辑小书的章节
router.get('/user-book/info', tokens.ClientVerifyToken, book_1.default.getUserBookInfo); // 获取用户自己的小书章节信息
router.get('/book/info', tokens.ClientVerifyTokenInfo, book_1.default.getBookInfo); // 获取小书章节信息
router.post('/book/next-prev', book_1.default.getNextPrevBook); // 获取小书上一页，下一页
router.post('/book/delete', tokens.ClientVerifyToken, book_1.default.deleteBook); // 删除用户自己的小书章节
router.post('/book/upload-book-picture', tokens.ClientVerifyToken, uploadModel('bookImg').single('file'), upload_1.default.uploadBookPicture); // 小书章节图片上传
// 小书评论
router.get('/books-comment/list', booksComment_1.default.getBooksCommentList); // 获取用户发表小书评论的评论列表 TYPE:AJAX get
router.post('/books-comment/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, booksComment_1.default.createBooksComment); // 用户小书发表评论 TYPE:AJAX post
router.post('/books-comment/delete', tokens.ClientVerifyToken, booksComment_1.default.deleteBooksComment); // 删除小书评论 TYPE:AJAX post
// 小书章节评论
router.get('/book-comment/list', bookComment_1.default.getBookCommentList); // 获取用户发表小书章节评论的评论列表 TYPE:AJAX get
router.post('/book-comment/create', tokens.ClientVerifyToken, verifyAuthority.ClientCheck, bookComment_1.default.createBookComment); // 用户小书章节评论发表评论 TYPE:AJAX post
router.post('/book-comment/delete', tokens.ClientVerifyToken, bookComment_1.default.deleteBookComment); // 删除小书章节评论 TYPE:AJAX post
router.get('/collect/books-list', tokens.ClientVerifyToken, books_1.default.getCollectBooksList); // 收藏小书
// 用户虚拟币开始 2019.11.4 0:19
// 签到
router.post('/virtual/check-in', tokens.ClientVerifyToken, virtual_1.default.checkIn);
// 虚拟币动态记录
router.get('/virtual/list', tokens.ClientVerifyToken, virtual_1.default.getVirtualList);
// 购买
router.post('/shop/buy', tokens.ClientVerifyToken, shop_1.default.Buy);
// 订单列表
router.get('/shop/list', tokens.ClientVerifyToken, shop_1.default.orderList);
// 获取用户关联信息
router.get('/user/associate-info', tokens.ClientVerifyTokenInfo, user_1.default.getUserAssociateinfo);
// 关注类
router.post('/common/attention', tokens.ClientVerifyToken, attention_1.default.setAttention);
router.post('/common/like', tokens.ClientVerifyToken, like_1.default.setLike); // like TYPE:AJAX post
router.post('/common/collect', tokens.ClientVerifyToken, collect_1.default.setCollect); // 收藏
router.post('/common/thumb', tokens.ClientVerifyToken, thumb_1.default.setThumb); // 用户点赞动态TYPE:AJAX post
router.get('/experience/list', tokens.ClientVerifyToken, experience_1.default.getExperienceList); // 获取经验列表
module.exports = router;
