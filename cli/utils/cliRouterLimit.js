const lowdb = require('../../db/lowdb')

class RouterLimit {
  static async Step (req, res, next) {
    let cli_step = lowdb.get('cli.step').value()
    let step_key = [
      '/init',
      '/init_step_one',
      '/init_step_two',
      '/init_step_three'
    ]
    let current_url = req.url
    let cli_is_success = lowdb.get('cli.is_success').value()
    if (cli_is_success) {
      await res.redirect('/')
    } else {
      if (current_url === step_key[cli_step]) {
        await next()
      } else {
        await res.redirect(step_key[cli_step])
      }
    }
  }

  static async ajaxCheck_Session (req, res, next) {
    if (req.session.islogin) {
      await next()
    } else {
      // 没有登录态则跳转到错误页面
      req.body = {
        state: 'error',
        message: '当前账号未登录，请登录后再尝试',
        is_login: false
      }
    }
  }
}

module.exports = RouterLimit
