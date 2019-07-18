const {
  sequelize,
  user_role,
  user_authority
} = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class UserRole {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建角色
   * @param   {object} ctx 上下文对象
   */
  static async create_user_role (ctx) {
    const req_data = ctx.request.body

    try {
      let find_user_role_name = await user_role.findOne({
        where: { user_role_name: req_data.user_role_name }
      })
      if (find_user_role_name) {
        throw new ErrorMessage('用户角色名已存在!')
      }

      await user_role.create({
        user_role_name: req_data.user_role_name,
        user_role_description: req_data.user_role_description,
        user_role_icon: req_data.user_role_icon,
        user_role_type: req_data.user_role_type,
        is_show: req_data.is_show,
        enable: req_data.enable
      })
      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 3,
        content: `成功创建了‘${req_data.user_role_name}’用户角色`
      })

      admin_resJson(ctx, {
        state: 'success',
        message: '角色创建成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 获取所有角色操作
   * @param   {object} ctx 上下文对象
   */
  static async get_user_role_all (ctx) {
    try {
      let user_role_all = await user_role.findAll({
        attributes: [
          'user_role_id',
          'user_role_name',
          'user_role_type',
          'user_role_description',
          'is_show',
          'user_role_icon',
          'user_authority_ids'
        ],
        where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          user_role_all: user_role_all
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 获取角色列表操作
   * @param   {object} ctx 上下文对象
   */
  static async get_user_role_list (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await user_role.findAndCountAll({
        attributes: [
          'user_role_id',
          'user_role_name',
          'user_role_description',
          'user_role_icon',
          'user_role_type',
          'is_show',
          'user_authority_ids',
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
    }
  }

  /**
   * 更新角色
   * @param   {object} ctx 上下文对象
   */
  static async update_user_role (ctx) {
    const req_data = ctx.request.body
    try {
      await user_role.update(
        {
          user_role_name: req_data.user_role_name,
          user_role_description: req_data.user_role_description,
          user_role_icon: req_data.user_role_icon,
          user_role_type: req_data.user_role_type,
          is_show: req_data.is_show,
          enable: req_data.enable
        },
        {
          where: {
            user_role_id: req_data.user_role_id // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新用户角色成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除角色
   */
  static async delete_user_role (ctx) {
    const { user_role_id } = ctx.request.body
    try {
      if (config.USER_ROLE.default_id === user_role_id) {
        admin_resJson(ctx, {
          state: 'error',
          message: '默认用户角色不可删除'
        })
        return false
      }

      if (config.USER_ROLE.commission_legalize_id === user_role_id) {
        admin_resJson(ctx, {
          state: 'error',
          message: '当前角色特殊原因不可删除'
        })
        return false
      }

      await user_role.destroy({ where: { user_role_id } })
      admin_resJson(ctx, {
        state: 'success',
        message: '删除用户角色成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建权限
   * @param   {object} ctx 上下文对象
   */
  static async create_user_authority (ctx) {
    const req_data = ctx.request.body

    try {
      let find_authority_name = await user_authority.findOne({
        where: { authority_name: req_data.authority_name }
      })
      if (find_authority_name) {
        throw new ErrorMessage('权限名已存在!')
      }
      let find_authority_url = await user_authority.findOne({
        where: { authority_url: req_data.authority_url }
      })
      if (find_authority_url) {
        throw new ErrorMessage('权限路径已存在!')
      }
      await user_authority.create({
        ...req_data
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '用户权限创建成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 获取权限列表
   * @param   {object} ctx 上下文对象
   */
  static async get_user_authority_list (ctx) {
    try {
      let user_authority_findAll = await user_authority.findAll()

      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: user_authority_findAll
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 修改权限
   * @param   {object} ctx 上下文对象
   */
  static async update_user_authority (ctx) {
    const req_data = ctx.request.body
    try {
      await user_authority.update(
        {
          authority_name: req_data.authority_name,
          authority_type: req_data.authority_type,
          authority_url: req_data.authority_url,
          authority_sort: req_data.authority_sort,
          authority_description: req_data.authority_description,
          enable: req_data.enable
        },
        {
          where: {
            authority_id: req_data.authority_id // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新权限成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除权限列表
   * @param   {object} ctx 上下文对象
   */
  static async delete_user_authority (ctx) {
    const { authority_id_arr } = ctx.request.body
    try {
      await user_authority.destroy({
        where: { authority_id: { [Op.in]: authority_id_arr } }
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '删除权限树成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 设置角色权限关联
   * @param   {object} ctx 上下文对象
   */

  static async set_user_role_authority (ctx) {
    const req_data = ctx.request.body
    try {
      await user_role.update(
        { user_authority_ids: req_data.role_authority_list_all.join(',') },
        {
          where: { user_role_id: req_data.user_role_id } // 查询条件
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '修改成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = UserRole
