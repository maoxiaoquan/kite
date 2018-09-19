const {sequelize, picture} = require('../models')
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
    let destination = ctx.req.file.destination
    let filename = ctx.req.file.filename

    home_resJson(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        filename: `${destination.split('static')[1] + '/' + filename}`//返回文件名
      }
    })
  }

}

module.exports = Picture