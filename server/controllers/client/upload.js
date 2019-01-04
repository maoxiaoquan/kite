const models = require('../../../db/mysqldb/index')
const { home_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../../config')
const moment = require('moment')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class Upload {
  constructor() {}

  /**
   * 用户头像上传修改
   * @param   {obejct} ctx 上下文对象
   */
  static async upload_user_avatar(ctx) {
    let destination = ctx.req.file.destination.split('static')[1]
    let filename = ctx.req.file.filename

    let user = await models.user.update(
      {
        avatar: `${destination + '/' + filename}`
      },
      {
        where: {
          uid: ctx.session.uid //查询条件
        }
      }
    )
    console.log('user.avatar', user)

    ctx.session.avatar = `${destination + '/' + filename}`

    home_resJson(ctx, {
      state: 'success',
      message: '修改用户头像成功'
    })
  }

  /**
   * 文章图片上传
   * @param   {obejct} ctx 上下文对象
   */
  static async upload_article_picture(ctx) {
    let destination = ctx.req.file.destination.split('static')[1]
    let filename = ctx.req.file.filename

    home_resJson(ctx, {
      state: 'success',
      message: '文章图片上传成功',
      data: {
        img: `${destination + '/' + filename}`
      }
    })
  }
}

module.exports = Upload
