const router = require('koa-router')()
const admin_users = require('../apis/admin_users')// admin_users
const users = require('../apis/users')// users
const articles = require('../apis/articles')// users
const role_authority = require('../apis/admin_role_authority')// role_authority
const tokens = require('../utils/tokens')
const verify_authority = require('../utils/verify_authority')

/* 前台用户 */
//获取用户列表
router.get('/get_user_list', tokens.verifyToken, users.get_user_list)
//更新用户
router.post('/edit_user', tokens.verifyToken, users.edit_user)
//删除用户
router.post('/delete_user', tokens.verifyToken, users.delete_user)

/* 文章管理 */
router.get('/get_article_list', tokens.verifyToken, articles.get_article_list)
//更新用户
router.post('/edit_article', tokens.verifyToken, articles.edit_article)
//删除用户
router.post('/delete_article', tokens.verifyToken, articles.delete_article)


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

module.exports = router