const router = require('koa-router')();
const sign = require('../apis/sign'); // sign 相关的参
const users = require('../apis/users')
const tokens = require('../utils/tokens')

//api 登录 POST
router.post('/user/sign_in', sign.sign_in)
//api 注册 POST
router.post('/user/sign_up', sign.sign_up)

//router.use('/user', tokens.testToken())
//api 获取用户 POST
//console.log('router',router)

router.post('/user/user_list', tokens.testToken, users.users_list)

module.exports = router