const data_format = require('../utils/data_format')
const db = require('../utils/db')
module.exports = {
  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  async sign_in(ctx) {
    ctx.body = {
      data: 'sign_in'
    }
  },

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async sign_up(ctx) {
    console.log('res', ctx.request.body)
    db.User.create({
      account: ctx.request.body.nickname,
      password: ctx.request.body.password,
      email: ctx.request.body.email
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p));
    }).catch(function (err) {
      console.log('failed: ' + err);
    });

    db.userInfo.create({
      account: ctx.request.body.nickname,
      password: ctx.request.body.password,
      email: ctx.request.body.email
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p));
    }).catch(function (err) {
      console.log('failed: ' + err);
    });

    data_format(ctx,
      {
        title: '66666'
      })
  }
}