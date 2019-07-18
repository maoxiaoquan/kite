class Format {
  /**
   * 登录信息数据的返回，附带token
   * @param  {object} ctx 上下文对象
   * @param  {Boolean} state 状态，必填,判断数据是否返回正确 success正常、error错误
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {String} token token
   * @param  {object} date 返回的数据
   * @param  {Boolean} is_login  是否登录
   */

  async client_resJson (ctx, { state, message, data = {} }) {
    ctx.body = {
      state,
      message,
      data
    }
  }

  async render (ctx, { title, view_url, state, message, data = {} }) {
    await ctx.render(view_url, {
      title,
      state,
      message,
      data
    })
  }
}

module.exports = new Format()
