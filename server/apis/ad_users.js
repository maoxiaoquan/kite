const de = require('../utils/res_data')
const db = require('../db/db')
const tokens = require('../utils/tokens')

class ad_users {
  constructor () {
    // super()
  }

  /**
   * 获取用户操作
   * @param   {obejct} ctx 上下文对象
   */
  async ad_users_list (ctx) {
    console.log('res', ctx.request.body)
    await db.ad_user.findAll()
      .then(function (p) {
        console.log('created.' + JSON.stringify(p))
        de.format_data(ctx, 'error', '请登录')
      }).catch(function (err) {
        console.log('failed: ' + err)
      })
  }

}

module.exports = new ad_users()