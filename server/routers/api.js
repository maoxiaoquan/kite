const router = require('koa-router')()
const ad_users = require('../apis/ad_users')// user
const role_authority = require('../apis/ad_role_authority')// user
const tokens = require('../utils/tokens')
const verify_authority = require('../utils/verify_authority')
/**
 * 管理员用户
 */

//登录
router.post('/sign_in', ad_users.ad_sign_in)
//创建用户
router.post('/create_admin_user', tokens.verifyToken, ad_users.create_admin_user)
//更新用户
router.post('/edit_admin_user', tokens.verifyToken, ad_users.edit_admin_user)
//删除用户
router.post('/delete_admin_user', tokens.verifyToken, verify_authority.check, ad_users.delete_admin_user)
//获取用户列表
router.get('/get_admin_user_list', tokens.verifyToken, ad_users.get_admin_user_list)

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
//删除用户角色关联
router.post('/delete_admin_user_role', tokens.verifyToken, role_authority.delete_admin_user_role)

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
//删除权限
router.post('/delete_admin_role_authority', tokens.verifyToken, role_authority.delete_admin_role_authority)
//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)

module.exports = router