const router = require('koa-router')()
const ad_sign = require('../apis/ad_sign') // sign
const ad_users = require('../apis/ad_users')// user
const role_authority = require('../apis/ad_role_authority')// user
const tokens = require('../utils/tokens')

//api 登录 POST
router.post('/sign_in', ad_sign.ad_sign_in)
//api 注册 POST
router.post('/sign_up', ad_sign.ad_sign_up)

//获取当前用户信息
router.get('/get_user', ad_users.ad_get_users)
//创建角色
router.post('/create_role', tokens.verifyToken, role_authority.create_role)

//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)


module.exports = router