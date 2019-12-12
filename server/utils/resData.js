class Format {
  /**
   * 登录信息数据的返回，附带token
   * @param  {object} res res
   * @param  {Boolean} state 状态，必填,判断数据是否返回正确 success正常、error错误
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {String} token token
   * @param  {object} date 返回的数据
   * @param  {Boolean} is_login  是否登录
   */

  async resSignJson (res, { state, message, token, date }, is_login = true) {
    res.json({
      state,
      message,
      token,
      date,
      is_login
    })
  }

  /**
   * 后台数据的返回,不附带token
   * @param  {object} res res,必填
   * @param  {number} state 状态，必填,判断数据是否返回正确 success正常、error错误
   * @param  {String} message 信息，必填,返回的弹窗信息
   * @param  {object} data 返回的数据
   * @param  {Boolean} is_login  是否登录
   */

  async resAdminJson (res, { state, message, data = {} }, is_login = true) {
    res.json({
      state,
      message,
      data,
      is_login
    })
  }

  /**
   * 前台页面数据返回
   */

  async resClientJson (res, { state, message, data = {} }) {
    await res.json({
      state,
      message,
      data
    })
  }

  async render (res, { title, view_url, state, message, data = {} }) {
    console.log('view_url', view_url)
    await res.render(view_url, {
      title,
      state,
      message,
      data,
      user_info: {
        islogin: res.session.islogin,
        uid: res.session.uid,
        avatar: res.session.avatar
      }
    })
  }
}

module.exports = new Format()
