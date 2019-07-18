const router = require('koa-router')()
const admin_users = require('../controllers/admin/admin_users') // 后台用户
const users = require('../controllers/admin/users') // 前台用户
const user_role_authority = require('../controllers/admin/user_role_authority') // 前台用户角色权限
const articles = require('../controllers/admin/articles') // 文章
const article_tag = require('../controllers/admin/article_tag') // 文章标签
const article_column = require('../controllers/admin/article_column') // 文章专栏 （专栏为官方）
const picture = require('../controllers/admin/picture') // 图片管理
const upload = require('../controllers/admin/upload') // 上传
const role_authority = require('../controllers/admin/admin_role_authority') // 后台角色权限
const comment = require('../controllers/admin/comment') // 评论
const admin_system_log = require('../controllers/admin/admin_system_log') // 系统日志
const system = require('../controllers/admin/system') // 系统配置
const admin_index = require('../controllers/admin/admin_index') // 登录tokens
const tokens = require('../utils/tokens') // 登录tokens
const options = require('../controllers/admin/options') // options 可增加选项栏
const verifyAuthority = require('../utils/verify_authority') // 权限验证

// 此文件所有接口都是后台管理员操作前后台数据所用

/* 前台用户 */
// 获取用户列表
router.get(
  '/user/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.get_user_list
)
// 更新用户资料
router.post(
  '/user/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.edit_user
)
// 删除用户
router.post(
  '/user/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.delete_user
)
// 待审核用户头像列表
router.get(
  '/user/avatar-review-list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  users.get_avatar_review
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
  articles.get_article_list
)
// 更新用户
router.post(
  '/article/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articles.edit_article
)
// 删除用户
router.post(
  '/article/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  articles.delete_article
)

/* 文章标签管理 */
/* 获取所有标签 */
router.get(
  '/article-tag/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_tag.get_article_tag_all
)
/* 根据分页获取标签 */
router.get(
  '/article-tag/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_tag.get_article_tag_list
)
/* 文章创建标签 */
router.post(
  '/article-tag/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_tag.create_article_tag
)
/* 文章更新标签 */
router.post(
  '/article-tag/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_tag.update_article_tag
)
/* 文章删除标签 */
router.post(
  '/article-tag/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_tag.delete_article_tag
)

/* 文章专栏管理 （专栏为官方） */
router.get(
  '/article-column/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_column.get_article_column_list
)
/* 文章创建专栏 */
router.post(
  '/article-column/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_column.create_article_column
)
/* 文章更新专栏 */
router.post(
  '/article-column/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_column.update_article_column
)
/* 文章删除专栏 */
router.post(
  '/article-column/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  article_column.delete_article_column
)

/* 文章专题管理 （专题为个人） */

// 用户标签管理
/* 根据分页获取用户角色 */
router.get(
  '/user-role/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.get_user_role_list
)
// 获取所有用户角色
router.get(
  '/user-role/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.get_user_role_all
)
// 创建用户角色
router.post(
  '/user-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.create_user_role
)
/* 用户更新用户角色 */
router.post(
  '/user-role/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.update_user_role
)
/* 用户删除用户角色 */
router.post(
  '/user-role/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.delete_user_role
)

// 获取用户权限列表
router.get(
  '/user-authority/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.get_user_authority_list
)
// 创建用户权限
router.post(
  '/user-authority/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.create_user_authority
)
// 更新用户权限
router.post(
  '/user-authority/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.update_user_authority
)
// 删除用户权限
router.post(
  '/user-authority/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.delete_user_authority
)
// 设置用户角色权限
router.post(
  '/user-role-authority/set',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  user_role_authority.set_user_role_authority
)

/* 图片管理 */
router.get(
  '/picture/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.get_picture_list
)
/* 图片创建 */
router.post(
  '/picture/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.create_picture
)
/* 图片更新 */
router.post(
  '/picture/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.update_picture
)
/* 图片删除 */
router.post(
  '/picture/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  picture.delete_picture
)

// 评论模块
// 评论分页列表
router.post(
  '/comment/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  comment.get_comment_list
)
// 评论数据更新
router.post(
  '/comment/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  comment.update_comment
)
// 评论数据删除
router.post(
  '/comment/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  comment.delete_comment
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
  admin_index.admin_index_statistics
)

/**
 * 管理员用户
 */
// 登录
router.post('/sign_in', admin_users.admin_sign_in)
// 创建管理员用户
router.post(
  '/admin-user/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_users.create_admin_user
)
// 更新管理员用户
router.post(
  '/admin-user/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_users.edit_admin_user
)
// 删除管理员用户
router.post(
  '/admin-user/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_users.delete_admin_user
)
// 获取管理员用户信息
router.post(
  '/admin-user/info',
  tokens.AdminVerifyToken,
  admin_users.get_admin_user_info
)
// 获取管理员用户列表
router.get(
  '/admin-user/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_users.get_admin_user_list
)

/**
 * 后台角色
 */
// 获取分页角色列表
router.get(
  '/admin-role/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.get_admin_role_list
)
// 获取全部角色
router.get(
  '/admin-role/all',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.get_admin_role_all
)
// 创建角色
router.post(
  '/admin-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.create_admin_role
)
// 删除角色
router.post(
  '/admin-role/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.delete_admin_role
)
// 更新角色
router.post(
  '/admin-role/edit',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.edit_admin_role
)

/**
 * 后台角色用户关联
 */

// 创建或者修改用户角色关联
router.post(
  '/admin-user-role/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.create_admin_user_role
)
/**
 * 后台权限
 */

// 获取权限列表
router.get(
  '/admin-authority/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.get_admin_authority_list
)
// 创建权限
router.post(
  '/admin-authority/create',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.create_admin_authority
)
// 更新权限
router.post(
  '/admin-authority/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.update_admin_authority
)
// 删除权限
router.post(
  '/admin-authority/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.delete_admin_authority
)

/**
 * 后台角色权限关联
 */

// 设置后台角色权限
router.post(
  '/admin-role-authority/set',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  role_authority.set_admin_role_authority
)

/**
 * 后台系统日志
 */

// 获取系统日志列表
router.get(
  '/admin-system-log/list',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_system_log.get_admin_system_log_list
)
// 获取系统配置
router.get(
  '/system-config/info',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  system.get_system_info
)
// 更新系统配置
router.post(
  '/system-config/update',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  system.update_system_info
)
// 删除系统日志
router.post(
  '/admin-system-log/delete',
  tokens.AdminVerifyToken,
  verifyAuthority.AdminCheck,
  admin_system_log.delete_admin_system_log
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

module.exports = router
