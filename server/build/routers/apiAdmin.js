"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminUsers_1 = __importDefault(require("../controllers/admin/adminUsers")); // 后台用户
const users_1 = __importDefault(require("../controllers/admin/users")); // 前台用户
const userRoleAuthority_1 = __importDefault(require("../controllers/admin/userRoleAuthority")); // 前台用户角色权限
const articles_1 = __importDefault(require("../controllers/admin/articles")); // 文章
const articleTag_1 = __importDefault(require("../controllers/admin/articleTag")); // 文章标签
const articleColumn_1 = __importDefault(require("../controllers/admin/articleColumn")); // 文章专栏 （专栏为官方）
const articleBlog_1 = __importDefault(require("../controllers/admin/articleBlog")); // 个人文章专栏 （专栏为个人）
const picture_1 = __importDefault(require("../controllers/admin/picture")); // 图片管理
const upload_1 = __importDefault(require("../controllers/admin/upload")); // 上传
const adminRoleAuthority_1 = __importDefault(require("../controllers/admin/adminRoleAuthority")); // 后台角色权限
const articleComment_1 = __importDefault(require("../controllers/admin/articleComment")); // 文章评论
const adminSystemLog_1 = __importDefault(require("../controllers/admin/adminSystemLog")); // 系统日志
const system_1 = __importDefault(require("../controllers/admin/system")); // 系统配置
const adminIndex_1 = __importDefault(require("../controllers/admin/adminIndex")); // 登录tokens
const options_1 = __importDefault(require("../controllers/admin/options")); // options 可增加选项栏
const dynamicTopic_1 = __importDefault(require("../controllers/admin/dynamicTopic")); // 动态专题
const dynamicComment_1 = __importDefault(require("../controllers/admin/dynamicComment")); // 动态专评论
const dynamics_1 = __importDefault(require("../controllers/admin/dynamics")); // 动态
const book_1 = __importDefault(require("../controllers/admin/book")); // 小书章节
const books_1 = __importDefault(require("../controllers/admin/books")); // 小书
const bookComment_1 = __importDefault(require("../controllers/admin/bookComment")); // 小书章节评论
const booksComment_1 = __importDefault(require("../controllers/admin/booksComment")); // 小书评价
// 此文件所有接口都是后台管理员操作前后台数据所用
const uploadModel = require('../utils/upload');
const router = express_1.default.Router();
const verifyAuthority = require('../utils/verifyAuthority'); // 权限验证
const tokens = require('../utils/tokens'); // 登录tokens
/* 前台用户 */
// 获取用户列表
router.get('/user/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.getUserList);
// 更新用户资料
router.post('/user/edit', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.editUser);
// 删除用户
router.post('/user/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.deleteUser);
// 待审核用户头像列表
router.get('/user/avatar-review-list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.getAvatarReview);
// 审核用户头像
router.post('/user/avatar-review-set', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.set_avatar_review);
// 禁言用户
router.post('/user/ban', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, users_1.default.banUser);
/* 文章管理 */
router.post('/article/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articles_1.default.getArticleList);
// 更新文章
router.post('/article/edit', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articles_1.default.editArticle);
// 删除文章
router.post('/article/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articles_1.default.deleteArticle);
/* 文章标签管理 */
/* 获取所有标签 */
router.get('/article-tag/all', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleTag_1.default.getArticleTagAll);
/* 根据分页获取标签 */
router.get('/article-tag/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleTag_1.default.getArticleTagList);
/* 文章创建标签 */
router.post('/article-tag/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleTag_1.default.createArticleTag);
/* 文章更新标签 */
router.post('/article-tag/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleTag_1.default.updateArticleTag);
/* 文章删除标签 */
router.post('/article-tag/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleTag_1.default.deleteArticleTag);
/* 文章专栏管理 （专栏为官方） */
router.get('/article-column/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleColumn_1.default.getArticleColumnList);
/* 文章创建专栏 */
router.post('/article-column/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleColumn_1.default.createArticleColumn);
/* 文章更新专栏 */
router.post('/article-column/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleColumn_1.default.updateArticleColumn);
/* 文章删除专栏 */
router.post('/article-column/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleColumn_1.default.deleteArticleColumn);
/* 个人专栏管理 （专栏为个人） */
router.get('/article-blog/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleBlog_1.default.getArticleBlogList);
/* 个人更新专栏 */
router.post('/article-blog/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleBlog_1.default.updateArticleBlog);
/* 文章专题管理 （专题为个人） */
// 用户标签管理
/* 根据分页获取用户角色 */
router.get('/user-role/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.getUserRoleList);
// 获取所有用户角色
router.get('/user-role/all', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.getUserRoleAll);
// 创建用户角色
router.post('/user-role/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.createUserRole);
/* 用户更新用户角色 */
router.post('/user-role/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.updateUserRole);
/* 用户删除用户角色 */
router.post('/user-role/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.deleteUserRole);
// 获取用户权限列表
router.get('/user-authority/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.getUserAuthorityList);
// 创建用户权限
router.post('/user-authority/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.createUserAuthority);
// 更新用户权限
router.post('/user-authority/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.updateUserAuthority);
// 删除用户权限
router.post('/user-authority/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.deleteUserAuthority);
// 设置用户角色权限
router.post('/user-role-authority/set', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, userRoleAuthority_1.default.setUserRoleAuthority);
/* 图片管理 */
router.get('/picture/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, picture_1.default.getPictureList);
/* 图片创建 */
router.post('/picture/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, picture_1.default.createPicture);
/* 图片更新 */
router.post('/picture/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, picture_1.default.updatePicture);
/* 图片删除 */
router.post('/picture/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, picture_1.default.deletePicture);
// 文章评论模块
// 评论分页列表
router.post('/article-comment/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleComment_1.default.getCommentList);
// 文章评论数据更新
router.post('/article-comment/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleComment_1.default.updateComment);
// 文章评论数据删除
router.post('/article-comment/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, articleComment_1.default.deleteComment);
/**
 * 上传
 */
router.post('/upload/picture', tokens.AdminVerifyToken, uploadModel('admin').single('file'), upload_1.default.uploadPicture); // 小书图片上传
/**
 *  首页数据
 */
router.get('/admin-index/statistics', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminIndex_1.default.adminIndexStatistics);
/**
 * 管理员用户
 */
// 登录
router.post('/sign-in', adminUsers_1.default.adminSignIn);
// 创建管理员用户
router.post('/admin-user/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminUsers_1.default.createAdminUser);
// 更新管理员用户
router.post('/admin-user/edit', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminUsers_1.default.editAdminUser);
// 删除管理员用户
router.post('/admin-user/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminUsers_1.default.deleteAdminUser);
// 获取管理员用户信息
router.post('/admin-user/info', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminUsers_1.default.getAdminUserInfo);
// 获取管理员用户列表
router.get('/admin-user/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminUsers_1.default.getAdminUserList);
/**
 * 后台角色
 */
// 获取分页角色列表
router.get('/admin-role/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.getAdminRoleList);
// 获取全部角色
router.get('/admin-role/all', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.getAdminRoleAll);
// 创建角色
router.post('/admin-role/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.createAdminRole);
// 删除角色
router.post('/admin-role/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.deleteAdminRole);
// 更新角色
router.post('/admin-role/edit', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.editAdminRole);
/**
 * 后台角色用户关联
 */
// 创建或者修改用户角色关联
router.post('/admin-user-role/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.createAdminUserRole);
/**
 * 后台权限
 */
// 获取权限列表
router.get('/admin-authority/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.getAdminAuthorityList);
// 创建权限
router.post('/admin-authority/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.createAdminAuthority);
// 更新权限
router.post('/admin-authority/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.updateAdminAuthority);
// 删除权限
router.post('/admin-authority/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.deleteAdminAuthority);
/**
 * 后台角色权限关联
 */
// 设置后台角色权限
router.post('/admin-role-authority/set', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminRoleAuthority_1.default.setAdminRoleAuthority);
/**
 * 后台系统日志
 */
// 获取系统日志列表
router.get('/admin-system-log/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminSystemLog_1.default.getAdminSystemLogList);
// 获取系统配置
router.get('/system-config/info', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, system_1.default.getSystemInfo);
// 更新系统配置
router.post('/system-config/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, system_1.default.updateSystemInfo);
// 删除系统日志
router.post('/admin-system-log/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, adminSystemLog_1.default.deleteAdminSystemLog);
// 获取网站配置项列表
router.get('/options/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, options_1.default.QueryOptions);
// 创建网站配置项
router.post('/options/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, options_1.default.createOptions);
// 更新网站配置项
router.post('/options/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, options_1.default.updateOptions);
// 删除网站配置项
router.post('/options/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, options_1.default.deleteOptions);
/* 动态话题管理 */
/* 获取所有话题 */
router.get('/dynamic-topic/all', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicTopic_1.default.getDynamicTopicAll);
/* 根据分页获取话题 */
router.get('/dynamic-topic/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicTopic_1.default.getDynamicTopicList);
/* 文章创建话题 */
router.post('/dynamic-topic/create', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicTopic_1.default.createDynamicTopic);
/* 文章更新话题 */
router.post('/dynamic-topic/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicTopic_1.default.updateDynamicTopic);
/* 文章删除话题 */
router.post('/dynamic-topic/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicTopic_1.default.deleteDynamicTopic);
/* 动态汇总 */
router.post('/dynamic/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamics_1.default.getDynamicList);
// 更新动态
router.post('/dynamic/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamics_1.default.updateDynamic);
// 删除动态
router.post('/dynamic/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamics_1.default.deleteDynamic);
// 动态评论模块
// 评论分页列表
router.post('/dynamic-comment/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicComment_1.default.getCommentList);
// 动态评论数据更新
router.post('/dynamic-comment/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicComment_1.default.updateComment);
// 动态评论数据删除
router.post('/dynamic-comment/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, dynamicComment_1.default.deleteComment);
// 2019.10.11 新增
// ---- 小书章节
/* 小书章节管理 */
router.post('/book/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, book_1.default.getBookList);
// 更新小书章节
router.post('/book/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, book_1.default.updateBook);
// 删除小书章节
router.post('/book/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, book_1.default.deleteBook);
// ---- 小书
router.post('/books/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, books_1.default.getBooksList);
// 更新小书章节
router.post('/books/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, books_1.default.updateBooks);
// 删除小书章节
router.post('/books/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, books_1.default.deleteBooks);
// 小书评论模块
// 小书评论分页列表
router.post('/books-comment/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, booksComment_1.default.getCommentList);
// 小书文章评论数据更新
router.post('/books-comment/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, booksComment_1.default.updateComment);
// 小书文章评论数据删除
router.post('/books-comment/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, booksComment_1.default.deleteComment);
// 小书章节评论模块
// 小书评论分页列表
router.post('/book-comment/list', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, bookComment_1.default.getCommentList);
// 小书文章评论数据更新
router.post('/book-comment/update', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, bookComment_1.default.updateComment);
// 小书文章评论数据删除
router.post('/book-comment/delete', tokens.AdminVerifyToken, verifyAuthority.AdminCheck, bookComment_1.default.deleteComment);
module.exports = router;
