const models = require('../models')
const {home_resJson} = require('../utils/res_data')
const {tools: {encrypt}} = require('../utils')
const config = require('../../config')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Picture {
  constructor () { }

  /**
   * @param   {obejct} ctx 上下文对象
   */
  static async upload_user_avatar (ctx) {
    let destination = ctx.req.file.destination.split('static')[1]
    let filename = ctx.req.file.filename


    let user = await models.user.update({
      avatar: `${destination + '/' + filename}`
    }, {
      where: {
        uid: ctx.session.uid//查询条件
      }
    })
    console.log('user.avatar',user)

    ctx.session.avatar = `${destination + '/' + filename}`


    home_resJson(ctx, {
      state: 'success',
      message: '修改用户头像成功',
    })
  }

}

module.exports = Picture