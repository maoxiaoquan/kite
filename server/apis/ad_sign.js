const {format_login, format_data} = require('../utils/res_data')
const db = require('../db/db')
const tokens = require('../utils/tokens')
const {checkUserName, checkPwd, checkEmail} = require('../utils/validators')
const {tools: {encrypt}} = require('../utils')
const config = require('../../config')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class ad_sign {
  constructor () {
    // super()
  }

  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  async ad_sign_in (ctx) {
    let req_data = ctx.request.body

    try {
      if (!req_data.account) {
        throw  new err_mess('请输入账户!')
      }

      if (!checkUserName(req_data.account)) {
        throw  new err_mess('5-12个英文字符!')
      }

      if (!req_data.password) {
        throw  new err_mess('请输入密码!')
      }

    } catch (err) {

      format_login(ctx, {
        state: 'error',
        message: err.message
      }, false)
      return false
    }

    await db.ad_user.findOne({
      where: {
        account: req_data.account
      }
    }).then(function (db_data) {
      if (db_data) {

        if (encrypt(req_data.password,config.encrypt_key) === db_data.password) {

          if (db_data.enable) {
            let datas = {account: req_data.account}
            let token = tokens.setToken('cxh', 3000, datas)

            format_login(ctx, {
              state: 'success',
              message: '登录成功',
              token
            })

          } else {
            format_login(ctx, {
              state: 'error',
              message: '您已被限制登录'
            }, false)
          }

        } else {

          format_login(ctx, {
            state: 'error',
            message: '密码错误'
          }, false)

        }
      } else {

        format_login(ctx, {
          state: 'error',
          message: '用户不存在'
        }, false)

      }

    }).catch(function (err) {
      console.log('failed: ' + err)
    })

  }

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async ad_sign_up (ctx) {
    const req_data = ctx.request.body

    try {
      if (!req_data.account) {
        throw  new err_mess('请输入账户!')
      }
      if (!checkUserName(req_data.account)) {
        throw  new err_mess('账户须5-12个英文字符!')
      }

      if (!req_data.password) {
        throw  new err_mess('请输入密码!')
      }

      if (!checkPwd(req_data.password)) {
        throw  new err_mess('密码输入有误!')
      }

      if (!checkEmail(req_data.email)) {
        throw  new err_mess('邮箱输入有误!')
      }

    } catch (err) {
      format_data(ctx, {
        state: 'error',
        message: err.message
      }, false)
      return false
    }

    await db.ad_user.create({
      account: req_data.account,
      password: encrypt(req_data.password,config.encrypt_key),
      email: req_data.email,
      enable: true
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '注册成功'
      }, false)
    }).catch(function (err) {
      console.log('failed: ' + err)
    })
  }

}

module.exports = new ad_sign()