class Format {
  constructor () {
    // super()
  }

  /**
   * 登录信息数据的返回，附带token
   * @param  {object} ctx 上下文对象
   * @param  {Boolean} state 状态，必填,判断数据是否返回正确 success正常、error错误
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {String} token token
   * @param  {object} date 返回的数据
   * @param  {Boolean} is_login  是否登录
   */

  async sign_resJson (ctx, {state, message, token, date}, is_login = true) {
    ctx.body = {
      state,
      message,
      token,
      date,
      is_login
    }
  }

  /**
   * 后台数据的返回,不附带token
   * @param  {object} ctx 上下文对象,必填
   * @param  {number} state 状态，必填,判断数据是否返回正确 success正常、error错误
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {object} data 返回的数据
   * @param  {Boolean} is_login  是否登录
   */

  async admin_resJson (ctx, {state, message, data = {}}, is_login = true) {
    ctx.body = {
      state,
      message,
      data,
      is_login
    }
  }


  /**
   * 前台页面数据返回
   */

  async home_resJson (ctx, {state, message, data = {}}) {
    ctx.body = {
      state,
      message,
      data
    }
  }

  async render (ctx, {title, view_url, state, message, data = {}}) {
    await ctx.render(view_url, {
      title,
      state,
      message,
      data,
      user_info: {
        islogin: ctx.session.islogin,
        nickname: ctx.session.nickname,
        uid: ctx.session.uid,
        avatar: ctx.session.avatar
      }
    })
  }

}

module.exports = new Format()