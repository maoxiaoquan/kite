const models = require('../../../db/mysqldb/index')
const { resClientJson } = require('../../utils/resData')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const moment = require('moment')
const multer = require('koa-multer')
const upload = require('../../utils/upload') // 上传工具类
const fs = require('fs')
const path = require('path')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Upload {
  /**
   * 用户头像上传修改
   * @param   {object} ctx 上下文对象
   */
  static async uploadUserAvatar (ctx) {
    try {
      await upload('avatarImg').single('file')(ctx)
      if (ctx.req.file) {
        let destination = ctx.req.file.destination.split('static')[1]
        let filename = ctx.req.file.filename
        let origin = ctx.request.header.origin
        let { user = '' } = ctx.request
        await models.userInfo.update(
          {
            avatar_review: `${origin}${destination}/${filename}`,
            avatar_review_status: 1
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
        resClientJson(ctx, {
          state: 'success',
          message: '上传用户头像成功，头像正在审核中'
        })
      } else {
        resClientJson(ctx, {
          state: 'error',
          message: '上传用户头像失败，文件格式有误'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '上传图片大于1m'
      })
      return false
    }
  }

  /**
   * 文章图片上传
   * @param   {object} ctx 上下文对象
   */
  static async uploadArticlePicture (ctx) {
    try {
      await upload('articleImg').single('file')(ctx)
      if (ctx.req.file) {
        let destination = ctx.req.file.destination.split('static')[1]
        let filename = ctx.req.file.filename
        let origin = ctx.request.header.origin
        resClientJson(ctx, {
          state: 'success',
          message: '文章图片上传成功',
          data: {
            img: `${origin}${destination}/${filename}`
          }
        })
      } else {
        resClientJson(ctx, {
          state: 'error',
          message: '文章图片上传成功失败，文件格式有误'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '上传图片大于1m'
      })
      return false
    }
  }
}

module.exports = Upload
