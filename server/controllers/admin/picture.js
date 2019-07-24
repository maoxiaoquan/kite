const { sequelize, picture } = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const moment = require('moment')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Picture {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {object} ctx 上下文对象
   */
  static async createPicture (ctx) {
    const req_data = ctx.request.body

    try {
      let find_picture_title = await picture.findOne({
        where: { picture_title: req_data.picture_title }
      })
      if (find_picture_title) {
        throw new ErrorMessage('图片标题名已存在!')
      }
      if (!req_data.picture_url) {
        throw new ErrorMessage('请上传图片!')
      }

      await picture.create({
        picture_title: req_data.picture_title,
        picture_url: req_data.picture_url
          ? req_data.picture_url[0].response.data.filename
          : '',
        description: req_data.description,
        enable: req_data.enable
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '图片创建成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取标签列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getPictureList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await picture.findAndCountAll({
        attributes: [
          'picture_id',
          'picture_title',
          'picture_url',
          'description',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新标签
   * @param   {object} ctx 上下文对象
   */
  static async updatePicture (ctx) {
    const req_data = ctx.request.body
    try {
      await picture.update(
        {
          picture_title: req_data.picture_title,
          picture_url: req_data.picture_url[0].response
            ? req_data.picture_url[0].response.data.filename
            : req_data.picture_url,
          description: req_data.description,
          enable: req_data.enable
        },
        {
          where: {
            picture_id: req_data.picture_id // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新图片成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除标签
   */
  static async deletePicture (ctx) {
    const { picture_id } = ctx.request.body
    try {
      await picture.destroy({ where: { picture_id } })
      admin_resJson(ctx, {
        state: 'success',
        message: '删除图片成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Picture
