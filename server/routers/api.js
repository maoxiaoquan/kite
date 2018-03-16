const router = require('koa-router')();
const sign = require('../apis/sign'); // api 登录

module.exports = router
  .post('/user/sign_in', sign.sign_in)
  .post('/user/sign_up', sign.sign_up)
