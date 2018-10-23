const { sequelize, picture } = require('../../db/mysqldb')
const { sign_resJson, admin_resJson } = require('../utils/res_data')
const moment = require('moment')
const {
  tools: { encrypt }
} = require('../utils')
const config = require('../../config')
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
  static async create_picture(ctx) {
    const req_data = ctx.request.body

    try {
      let find_picture_title = await picture.findOne({
        where: { picture_title: req_data.picture_title }
      })
      if (find_picture_title) {
        throw new err_mess('图片标题名已存在!')
      }
      if (!req_data.picture_url) {
        throw new err_mess('请上传图片!')
      }
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    await picture
      .create({
        picture_title: req_data.picture_title,
        picture_url: req_data.picture_url
          ? req_data.picture_url[0].response.data.filename
          : '',
        picture_type: req_data.picture_type,
        enable: req_data.enable
      })
      .then(function(p) {
        console.log('created.' + JSON.stringify(p))
        admin_resJson(ctx, {
          state: 'success',
          message: '图片创建成功'
        })
      })
      .catch(function(err) {
        console.log('failed: ' + err)
        admin_resJson(ctx, {
          state: 'error',
          message: '图片创建出错'
        })
      })
  }

  /**
   * 获取标签列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_picture_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await picture.findAndCountAll({
      attributes: [
        'picture_id',
        'picture_title',
        'picture_url',
        'picture_type',
        'enable'
      ],
      where: '', //为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize) //每页限制返回的数据条数
    })
    admin_resJson(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: count,
        list: rows
      }
    })
  }

  /**
   * 更新标签
   * @param   {obejct} ctx 上下文对象
   */
  static async update_picture(ctx) {
    const req_data = ctx.request.body
    await picture
      .update(
        {
          picture_title: req_data.picture_title,
          picture_url: req_data.picture_url[0].response
            ? req_data.picture_url[0].response.data.filename
            : req_data.picture_url,
          picture_type: req_data.picture_type,
          enable: req_data.enable
        },
        {
          where: {
            picture_id: req_data.picture_id //查询条件
          }
        }
      )
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '更新图片成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '更新图片失败'
        })
      })
  }

  /**
   * 删除标签
   */
  static async delete_picture(ctx) {
    const { picture_id } = ctx.request.body

    await picture
      .destroy({ where: { picture_id } })
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除图片成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除图片失败'
        })
      })
  }
}

module.exports = Picture
