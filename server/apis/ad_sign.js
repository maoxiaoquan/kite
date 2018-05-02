const de = require('../utils/data_example')
const db = require('../db/db')
const tokens = require('../utils/tokens')

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
    await db.ad_user.findOne({
      where: {
        account: req_data.account
      }
    }).then(function (db_data) {
      if (db_data) {
        console.log(req_data.account, '------------', db_data.password)
        if (req_data.password === db_data.password) {
          let datas = {account: req_data.account}
          let token = tokens.setToken('cxh', 300, datas)

          de.format_login(ctx, {
            state: 'success',
            message: '登录成功',
            token
          })

        } else {

          de.format_login(ctx, {
            state: 'error',
            message: '密码错误'
          }, false)

        }
      } else {

        de.format_login(ctx, {
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
    console.log('res', ctx.request.body)

    await db.ad_user.create({
      account: ctx.request.body.account,
      password: ctx.request.body.password,
      email: ctx.request.body.email
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      de.format_data(ctx, {
        state: 'success',
        message: '注册成功'
      }, false)
    }).catch(function (err) {
      console.log('failed: ' + err)
    })
  }

}

module.exports = new ad_sign()