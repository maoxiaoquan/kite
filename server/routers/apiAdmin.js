const router = require('koa-router')()
const adminUser = require('../controllers/admin/adminUsers') // 后台用户
const users = require('../controllers/admin/users') // 前台用户
const userRoleAuthority = require('../controllers/admin/userRoleAuthority') // 前台用户角色权限
const articles = require('../controllers/admin/articles') // 文章
const articleTag = require('../controllers/admin/articleTag') // 文章标签
const articleColumn = require('../controllers/admin/articleColumn') // 文章专栏 （专栏为官方）
const picture = require('../controllers/admin/picture') // 图片管理
const upload = require('../controllers/admin/upload') // 上传
const adminRoleAuthority = require('../controllers/admin/adminRoleAuthority') // 后台角色权限
const articleComment = require('../controllers/admin/articleComment') // 文章评论
const adminSystemLog = require('../controllers/admin/adminSystemLog') // 系统日志
const system = require('../controllers/admin/system') // 系统配置
const adminIndex = require('../controllers/admin/adminIndex') // 登录tokens
const tokens = require('../utils/tokens') // 登录tokens
const options = require('../controllers/admin/options') // options 可增加选项栏
const verifyAuthority = require('../utils/verifyAuthority') // 权限验证
const dynamicTopic = require('../controllers/admin/dynamicTopic') // 动态专题
const dynamicComment = require('../controllers/admin/dynamicComment') // 动态专评论
const dynamics = require('../controllers/admin/dynamics') // 动态
// 此文件所有接口都是后台管理员操作前后台数据所用

/* 前台用户 */
// 获取用户列表
router.get(
  '/user/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.getUserList
)
// 更新用户资料
router.post(
  '/user/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.editUser
)
// 删除用户
router.post(
  '/user/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.deleteUser
)
// 待审核用户头像列表
router.get(
  '/user/avatar-review-list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.getAvatarReview
)
// 审核用户头像
router.post(
  '/user/avatar-review-set',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.set_avatar_review
)
// 禁言用户
router.post(
  '/user/ban',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.banUser
)

/* 文章管理 */
router.post(
  '/article/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articles.getArticleList
)
// 更新文章
router.post(
  '/article/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articles.editArticle
)
// 删除文章
router.post(
  '/article/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articles.deleteArticle
)

/* 文章标签管理 */
/* 获取所有标签 */
router.get(
  '/article-tag/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleTag.getArticleTagAll
)
/* 根据分页获取标签 */
router.get(
  '/article-tag/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleTag.getArticleTagList
)
/* 文章创建标签 */
router.post(
  '/article-tag/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleTag.createArticleTag
)
/* 文章更新标签 */
router.post(
  '/article-tag/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleTag.updateArticleTag
)
/* 文章删除标签 */
router.post(
  '/article-tag/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleTag.deleteArticleTag
)

/* 文章专栏管理 （专栏为官方） */
router.get(
  '/article-column/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleColumn.getArticleColumnList
)
/* 文章创建专栏 */
router.post(
  '/article-column/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleColumn.createArticleColumn
)
/* 文章更新专栏 */
router.post(
  '/article-column/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleColumn.updateArticleColumn
)
/* 文章删除专栏 */
router.post(
  '/article-column/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleColumn.deleteArticleColumn
)

/* 文章专题管理 （专题为个人） */

// 用户标签管理
/* 根据分页获取用户角色 */
router.get(
  '/user-role/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.getUserRoleList
)
// 获取所有用户角色
router.get(
  '/user-role/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.getUserRoleAll
)
// 创建用户角色
router.post(
  '/user-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.createUserRole
)
/* 用户更新用户角色 */
router.post(
  '/user-role/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.updateUserRole
)
/* 用户删除用户角色 */
router.post(
  '/user-role/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.deleteUserRole
)

// 获取用户权限列表
router.get(
  '/user-authority/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.getUserAuthorityList
)
// 创建用户权限
router.post(
  '/user-authority/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.createUserAuthority
)
// 更新用户权限
router.post(
  '/user-authority/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.updateUserAuthority
)
// 删除用户权限
router.post(
  '/user-authority/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.deleteUserAuthority
)
// 设置用户角色权限
router.post(
  '/user-role-authority/set',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  userRoleAuthority.setUserRoleAuthority
)

/* 图片管理 */
router.get(
  '/picture/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.getPictureList
)
/* 图片创建 */
router.post(
  '/picture/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.createPicture
)
/* 图片更新 */
router.post(
  '/picture/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.updatePicture
)
/* 图片删除 */
router.post(
  '/picture/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.deletePicture
)

// 文章评论模块
// 评论分页列表
router.post(
  '/article-comment/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleComment.getCommentList
)
// 文章评论数据更新
router.post(
  '/article-comment/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleComment.updateComment
)
// 文章评论数据删除
router.post(
  '/article-comment/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articleComment.deleteComment
)

/**
 * 上传
 */

router.post(
  '/upload/picture',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  upload.uploadPicture
)

/**
 *  首页数据
 */

router.get(
  '/admin-index/statistics',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminIndex.adminIndexStatistics
)

/**
 * 管理员用户
 */
// 登录
router.post('/sign-in', adminUser.adminSignIn)
// 创建管理员用户
router.post(
  '/admin-user/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminUser.createAdminUser
)
// 更新管理员用户
router.post(
  '/admin-user/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminUser.editAdminUser
)
// 删除管理员用户
router.post(
  '/admin-user/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminUser.deleteAdminUser
)
// 获取管理员用户信息
router.post(
  '/admin-user/info',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminUser.getAdminUserInfo
)
// 获取管理员用户列表
router.get(
  '/admin-user/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminUser.getAdminUserList
)

/**
 * 后台角色
 */
// 获取分页角色列表
router.get(
  '/admin-role/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.getAdminRoleList
)
// 获取全部角色
router.get(
  '/admin-role/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.getAdminRoleAll
)
// 创建角色
router.post(
  '/admin-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.createAdminRole
)
// 删除角色
router.post(
  '/admin-role/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.deleteAdminRole
)
// 更新角色
router.post(
  '/admin-role/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.editAdminRole
)

/**
 * 后台角色用户关联
 */

// 创建或者修改用户角色关联
router.post(
  '/admin-user-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.createAdminUserRole
)
/**
 * 后台权限
 */

// 获取权限列表
router.get(
  '/admin-authority/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.getAdminAuthorityList
)
// 创建权限
router.post(
  '/admin-authority/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.createAdminAuthority
)
// 更新权限
router.post(
  '/admin-authority/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.updateAdminAuthority
)
// 删除权限
router.post(
  '/admin-authority/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.deleteAdminAuthority
)

/**
 * 后台角色权限关联
 */

// 设置后台角色权限
router.post(
  '/admin-role-authority/set',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminRoleAuthority.setAdminRoleAuthority
)

/**
 * 后台系统日志
 */

// 获取系统日志列表
router.get(
  '/admin-system-log/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminSystemLog.getAdminSystemLogList
)
// 获取系统配置
router.get(
  '/system-config/info',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  system.getSystemInfo
)
// 更新系统配置
router.post(
  '/system-config/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  system.updateSystemInfo
)
// 删除系统日志
router.post(
  '/admin-system-log/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  adminSystemLog.deleteAdminSystemLog
)

// 获取网站配置项列表
router.get(
  '/options/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  options.QueryOptions
)
// 创建网站配置项
router.post(
  '/options/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  options.createOptions
)
// 更新网站配置项
router.post(
  '/options/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  options.updateOptions
)
// 删除网站配置项
router.post(
  '/options/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  options.deleteOptions
)

/* 动态话题管理 */
/* 获取所有话题 */
router.get(
  '/dynamic-topic/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicTopic.getDynamicTopicAll
)
/* 根据分页获取话题 */
router.get(
  '/dynamic-topic/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicTopic.getDynamicTopicList
)
/* 文章创建话题 */
router.post(
  '/dynamic-topic/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicTopic.createDynamicTopic
)
/* 文章更新话题 */
router.post(
  '/dynamic-topic/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicTopic.updateDynamicTopic
)
/* 文章删除话题 */
router.post(
  '/dynamic-topic/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicTopic.deleteDynamicTopic
)

/* 动态汇总 */
router.post(
  '/dynamic/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamics.getDynamicList
)
// 更新动态
router.post(
  '/dynamic/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamics.updateDynamic
)
// 删除动态
router.post(
  '/dynamic/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamics.deleteDynamic
)

// 动态评论模块
// 评论分页列表
router.post(
  '/dynamic-comment/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicComment.getCommentList
)
// 动态评论数据更新
router.post(
  '/dynamic-comment/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicComment.updateComment
)
// 动态评论数据删除
router.post(
  '/dynamic-comment/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  dynamicComment.deleteComment
)

module.exports = router
