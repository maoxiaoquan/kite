const {sequelize, picture} = require('../models')
const {format_login, format_data} = require('../utils/res_data')
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
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {obejct} ctx 上下文对象
   */
  static async upload_picture (ctx) {
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        filename: `/upload/public/${ctx.req.file.filename}`//返回文件名
      }
    })
  }

}

module.exports = Picture