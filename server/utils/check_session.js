class Check_Session {
  static async Check_Session (ctx, next) {
    if (ctx.session.islogin) {
      await next()
    } else {
      // 没有登录态则跳转到错误页面
      ctx.redirect('/sign_in')
    }
  }
}

module.exports = Check_Session
