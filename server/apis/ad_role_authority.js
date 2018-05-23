const {format_data} = require('../utils/res_data')
const {ad_role} = require('../db/db')
const tokens = require('../utils/tokens')

class role_authority {
  constructor () {
    // super()
  }

  /**
   * 获取用户操作
   * @param   {obejct} ctx 上下文对象
   */
  static async ad_get (ctx) {

  }

  static async create_role (ctx) {

    const req_data = ctx.request.body

    let find_role = await ad_role.findOne({
      where: {
        account: req_data.account
      }
    })

    await ad_role.create({
      account: req_data.account,
      enable: true
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '角色创建成功'
      }, false)
    }).catch(function (err) {
      console.log('failed: ' + err)
    })
  }


}

module.exports = role_authority