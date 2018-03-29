const de = require('../utils/data_example')
const db = require('../utils/db')
const tokens = require('../utils/tokens')

class sign {
  constructor() {
    // super()
  }
  /**
     * 登录操作
     * @param  {obejct} ctx 上下文对象
     */
  async sign_in(ctx) {
    let req_data = ctx.request.body
    await db.ad_user.findOne({
      where: {
        account: req_data.account
      }
    }).then(function (db_data) {
      if (db_data) {
        console.log(req_data.account, '------------', db_data.password)
        if (req_data.password == db_data.password) {
          var datas = { account: req_data.account }
          var token = tokens.setToken('cxh', 300, datas)
          de.format_login(ctx,
            true,
            '登录成功',
            token,
            {
              title: '登录成功已成功，token已返回'
            }
          )
        } else {
          de.format_login(ctx,
            false,
            '密码错误'
          )
        }
      } else {
        de.format_login(ctx,
          false,
          '用户不存在'
        )
      }


    }).catch(function (err) {
      console.log('failed: ' + err);
    });

  }

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async sign_up(ctx) {
    console.log('res', ctx.request.body)

    await db.ad_user.create({
      account: ctx.request.body.account,
      password: ctx.request.body.password,
      email: ctx.request.body.email
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p));
      de.format_data(ctx, 1, '注册成功')
    }).catch(function (err) {
      console.log('failed: ' + err);
    });
  }

}


module.exports = new sign()