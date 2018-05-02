class Format {
  constructor () {
    // super()
  }

  /**
   * 登录信息数据的返回，附带token
   * @param  {obejct} ctx 上下文对象
   * @param  {Booleans} statu 状态，必填,判断数据是否返回正确 1正常、2错误、3未登录、4登录超时
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {String} token token
   * @param  {obejct} date 返回的数据
   * @param  {number} status 状态码，必填
   */

  async format_login (ctx, {state, message, token, date}, is_login = true) {
    ctx.body = {
      state,
      message,
      token,
      date,
      is_login
    }
  }

  /**
   * 常用数据的返回,不附带token
   * @param  {obejct} ctx 上下文对象,必填
   * @param  {number} status 状态，必填,判断数据是否返回正确 1正常、2错误、3未登录、4登录超时
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {obejct} date 返回的数据
   * @param  {number} status 状态码，必填
   */

  async format_data (ctx, {state, message, date = {}}, is_login = true) {
    ctx.body = {
      state,
      message,
      date,
      is_login
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
        account: ctx.session.nickname,
        user_id: ctx.session.user_id
      }
    })
  }

}

module.exports = new Format()