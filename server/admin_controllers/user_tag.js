const { sequelize, user_tag } = require('../../db/mysqldb')
const { sign_resJson, admin_resJson } = require('../utils/res_data')
const {
  tools: { encrypt }
} = require('../utils')
const config = require('../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class User_Tag {
  constructor() {}

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {obejct} ctx 上下文对象
   */
  static async create_user_tag(ctx) {
    const req_data = ctx.request.body

    try {
      let find_user_tag_name = await user_tag.findOne({
        where: { user_tag_name: req_data.user_tag_name }
      })
      if (find_user_tag_name) {
        throw new err_mess('用户标签名已存在!')
      }
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    await user_tag
      .create({
        user_tag_name: req_data.user_tag_name,
        user_tag_description: req_data.user_tag_description,
        user_tag_icon: req_data.user_tag_icon,
        user_tag_icon_type: req_data.user_tag_icon_type,
        enable: req_data.enable
      })
      .then(async function(p) {
        console.log('created.' + JSON.stringify(p))

        await create_admin_system_log({
          // 写入日志
          uid: ctx.request.userInfo.uid,
          type: 3,
          content: `成功创建了‘${req_data.user_tag_name}’用户标签`
        })

        admin_resJson(ctx, {
          state: 'success',
          message: '标签创建成功'
        })
      })
      .catch(function(err) {
        console.log('failed: ' + err)
        admin_resJson(ctx, {
          state: 'error',
          message: '标签创建出错'
        })
      })
  }

  /**
   * 获取所有标签操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_tag_all(ctx) {
    let user_tag_all = await user_tag.findAll({
      attributes: [
        'user_tag_id',
        'user_tag_name',
        'user_tag_description',
        'user_tag_icon',
        'user_tag_icon_type'
      ],
      where: { enable: 1 } //为空，获取全部，也可以自己添加条件
    })
    admin_resJson(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        user_tag_all: user_tag_all
      }
    })
  }

  /**
   * 获取标签列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_tag_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await user_tag.findAndCountAll({
      attributes: [
        'user_tag_id',
        'user_tag_name',
        'user_tag_description',
        'user_tag_icon',
        'user_tag_icon_type'
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
  static async update_user_tag(ctx) {
    const req_data = ctx.request.body
    await user_tag
      .update(
        {
          user_tag_name: req_data.user_tag_name,
          user_tag_description: req_data.user_tag_description,
          user_tag_icon: req_data.user_tag_icon,
          user_tag_icon_type: req_data.user_tag_icon_type
        },
        {
          where: {
            user_tag_id: req_data.user_tag_id //查询条件
          }
        }
      )
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '更新用户标签成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '更新用户标签失败'
        })
      })
  }

  /**
   * 删除标签
   */
  static async delete_user_tag(ctx) {
    const { user_tag_id } = ctx.request.body

    await user_tag
      .destroy({ where: { user_tag_id } })
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除用户标签成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除用户标签失败'
        })
      })
  }
}

module.exports = User_Tag
