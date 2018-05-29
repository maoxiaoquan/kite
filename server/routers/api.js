const router = require('koa-router')()
const ad_sign = require('../apis/ad_sign') // sign
const ad_users = require('../apis/ad_users')// user
const role_authority = require('../apis/ad_role_authority')// user
const tokens = require('../utils/tokens')

//api 登录 POST
router.post('/sign_in', ad_sign.ad_sign_in)
//api 注册 POST
router.post('/sign_up', ad_sign.ad_sign_up)

//获取当前用户列表
router.get('/get_admin_user_list', ad_users.get_admin_user_list)

//获取角色列表
router.get('/get_admin_role_list', role_authority.get_admin_role_list)
//创建角色
router.post('/create_admin_role', role_authority.create_admin_role)

//获取权限列表
router.get('/get_admin_authority_list', role_authority.get_admin_authority_list)
//创建权限
router.post('/create_admin_authority', role_authority.create_admin_authority)

//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)

module.exports = router