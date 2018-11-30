const { sequelize, picture } = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class Picture {
  constructor() {}

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {obejct} ctx 上下文对象
   */
  static async upload_picture(ctx) {
    let destination = ctx.req.file.destination.split('static')[1]
    let filename = ctx.req.file.filename

    admin_resJson(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        filename: `${destination + '/' + filename}` //返回文件名
      }
    })
  }
}

module.exports = Picture
