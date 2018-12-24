const router = require('koa-router')()
const admin_users = require('../controllers/admin/admin_users')// 后台用户
const users = require('../controllers/admin/users')// 前台用户
const user_tag = require('../controllers/admin/user_tag')// 前台用户标签
const articles = require('../controllers/admin/articles')//文章
const article_tag = require('../controllers/admin/article_tag')// 文章标签
const article_column = require('../controllers/admin/article_column')// 文章专栏 （专栏为官方）
const picture = require('../controllers/admin/picture')// 图片管理
const upload = require('../controllers/admin/upload')// 上传
const role_authority = require('../controllers/admin/admin_role_authority')// 后台角色权限
const comment = require('../controllers/admin/comment')// 评论
const admin_system_log = require('../controllers/admin/admin_system_log')// 评论
const banner = require('../controllers/admin/banner')//  banner 配置
const admin_index = require('../controllers/admin/admin_index') //登录tokens
const tokens = require('../utils/tokens') //登录tokens
const verify_authority = require('../utils/verify_authority') //权限验证

/*工具类*/
const util_upload = require('../utils/upload')
// 此文件所有接口都是后台管理员操作前后台数据所用

/* 前台用户 */
//获取用户列表
router.get('/get_user_list', tokens.verifyToken, users.get_user_list)
//更新用户资料
router.post('/edit_user', tokens.verifyToken, users.edit_user)
//删除用户
router.post('/delete_user', tokens.verifyToken, users.delete_user)

/* 文章管理 */
router.get('/get_article_list', tokens.verifyToken, articles.get_article_list)
//更新用户
router.post('/edit_article', tokens.verifyToken, articles.edit_article)
//删除用户
router.post('/delete_article', tokens.verifyToken, articles.delete_article)

/*文章标签管理*/
/*获取所有标签*/
router.get('/get_article_tag_all', tokens.verifyToken, article_tag.get_article_tag_all)
/*根据分页获取标签*/
router.get('/get_article_tag_list', tokens.verifyToken, article_tag.get_article_tag_list)
/*文章创建标签*/
router.post('/create_article_tag', tokens.verifyToken, article_tag.create_article_tag)
/*文章更新标签*/
router.post('/update_article_tag', tokens.verifyToken, article_tag.update_article_tag)
/*文章删除标签*/
router.post('/delete_article_tag', tokens.verifyToken, article_tag.delete_article_tag)

/*文章专栏管理 （专栏为官方）*/
router.get('/get_article_column_list', tokens.verifyToken, article_column.get_article_column_list)
/*文章创建专栏*/
router.post('/create_article_column', tokens.verifyToken, article_column.create_article_column)
/*文章更新专栏*/
router.post('/update_article_column', tokens.verifyToken, article_column.update_article_column)
/*文章删除专栏*/
router.post('/delete_article_column', tokens.verifyToken, article_column.delete_article_column)

/*文章专题管理 （专题为个人）*/

// 用户标签管理
/*根据分页获取用户标签*/
router.get('/get_user_tag_list', tokens.verifyToken, user_tag.get_user_tag_list)
// 获取所有用户标签
router.get('/get_user_tag_all', tokens.verifyToken, user_tag.get_user_tag_all)
// 创建用户标签
router.post('/create_user_tag', tokens.verifyToken, user_tag.create_user_tag)
/*用户更新用户标签*/
router.post('/update_user_tag', tokens.verifyToken, user_tag.update_user_tag)
/*用户删除用户标签*/
router.post('/delete_user_tag', tokens.verifyToken, user_tag.delete_user_tag)

/*图片管理*/
router.get('/get_picture_list', tokens.verifyToken, picture.get_picture_list)
/*图片创建*/
router.post('/create_picture', tokens.verifyToken, picture.create_picture)
/*图片更新*/
router.post('/update_picture', tokens.verifyToken, picture.update_picture)
/*图片删除*/
router.post('/delete_picture', tokens.verifyToken, picture.delete_picture)

// 评论模块
// 评论分页列表
router.get('/get_comment_list', tokens.verifyToken, comment.get_comment_list)
// 评论数据更新
router.post('/update_comment', tokens.verifyToken, comment.update_comment)
// 评论数据删除
router.post('/delete_comment', tokens.verifyToken, comment.delete_comment)

/**
 * 上传
 */

router.post('/upload_picture', tokens.verifyToken, util_upload('admin_swiper').single('file'), upload.upload_picture)

/**
 *  首页数据
 */

router.get('/get_admin_index_statistics', tokens.verifyToken, admin_index.admin_index_statistics)

/**
 * 管理员用户
 */
//登录
router.post('/sign_in', admin_users.admin_sign_in)
//创建用户
router.post('/create_admin_user', /* tokens.verifyToken,  */admin_users.create_admin_user)
//更新用户
router.post('/edit_admin_user', tokens.verifyToken, admin_users.edit_admin_user)
//删除用户
router.post('/delete_admin_user', tokens.verifyToken, /* verify_authority.check, */ admin_users.delete_admin_user)
//获取用户信息
router.post('/get_admin_user_info', tokens.verifyToken, /* verify_authority.check, */ admin_users.get_admin_user_info)
//获取用户列表
router.get('/get_admin_user_list', tokens.verifyToken, admin_users.get_admin_user_list)

/**
 * 后台角色
 */
//获取分页角色列表
router.get('/get_admin_role_list', tokens.verifyToken, role_authority.get_admin_role_list)
//获取全部角色
router.get('/get_admin_role_all', tokens.verifyToken, role_authority.get_admin_role_all)
//创建角色
router.post('/create_admin_role', tokens.verifyToken, role_authority.create_admin_role)
//删除角色
router.post('/delete_admin_role', tokens.verifyToken, role_authority.delete_admin_role)
//更新角色
router.post('/edit_admin_role', tokens.verifyToken, role_authority.edit_admin_role)

/**
 * 后台角色用户关联
 */

//创建或者修改用户角色关联
router.post('/create_admin_user_role', tokens.verifyToken, role_authority.create_admin_user_role)
//获取所有用户角色关联表
router.get('/get_admin_user_role_all', tokens.verifyToken, role_authority.get_admin_user_role_all)
/**
 * 后台权限
 */

//获取权限列表
router.get('/get_admin_authority_list', tokens.verifyToken, role_authority.get_admin_authority_list)
//创建权限
router.post('/create_admin_authority', tokens.verifyToken, role_authority.create_admin_authority)
//更新权限
router.post('/update_admin_authority', tokens.verifyToken, role_authority.update_admin_authority)
//删除权限
router.post('/delete_admin_authority', tokens.verifyToken, role_authority.delete_admin_authority)

/**
 * 后台角色权限关联
 */

//获取权限
router.get('/get_admin_role_authority', tokens.verifyToken, role_authority.get_admin_role_authority)
//设置权限
router.post('/set_admin_role_authority', tokens.verifyToken, role_authority.set_admin_role_authority)
//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)

/**
 * banner 设置
 */
// 获取 banner
router.get('/banner_list', tokens.verifyToken, banner.get_banner_list)
//设置banner
router.post('/create_banner', tokens.verifyToken, banner.create_banner)

/**
 * 后台系统日志
 */

// 获取分页系统日志
router.get('/get_admin_system_log_list', tokens.verifyToken, admin_system_log.get_admin_system_log_list) // 无权限
//删除系统日志
router.post('/delete_admin_system_log', tokens.verifyToken, admin_system_log.delete_admin_system_log) // 需设置权限

module.exports = router
