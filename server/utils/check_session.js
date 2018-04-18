class Check_Session {
  constructor () { }

  async Check_Session (ctx, next) {

    if (ctx.session.islogin) {
      await next()
    } else {
      // 没有登录态则跳转到错误页面
      ctx.redirect('/sign_in')
    }
  }

  async ajaxCheck_Session (ctx, next) {

    if (ctx.session.islogin) {
      await next()
    } else {
      // 没有登录态则跳转到错误页面
      ctx.body = {
        status: 3,
        message: '当前账号未登录，请登录后再尝试'
      }
    }
  }

}

module.exports = new Check_Session()