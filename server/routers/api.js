const router = require('koa-router')();
const ad_sign = require('../apis/ad_sign'); // sign 相关的参
const ad_users = require('../apis/ad_users')
const tokens = require('../utils/tokens')

//api 登录 POST
router.post('/user/sign_in', ad_sign.ad_sign_in)
//api 注册 POST
router.post('/user/sign_up', ad_sign.ad_sign_up)

//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)

router.post('/user/user_list', tokens.testToken, ad_users.ad_users_list)

module.exports = router