const { admin_resJson } = require('../../utils/res_data')
const {
  admin_role,
  admin_user,
  admin_authority
} = require('../../../db/mysqldb/index')
const { isEmpty } = require('../../utils/tools')
const { create_admin_system_log } = require('./adminSystemLog')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class role_authority {
  /**
   * -----------------------------------角色操作--------------------------------
   * 创建角色
   * @param   {object} ctx 上下文对象
   */
  static async createAdminRole (ctx) {
    const { role_name, role_description } = ctx.request.body
    try {
      if (!role_name) {
        throw new ErrorMessage('请输入角色名!')
      }
      if (!role_description) {
        throw new ErrorMessage('请输入角色介绍!')
      }
      let find_role = await admin_role.findOne({ where: { role_name } })
      if (find_role) {
        throw new ErrorMessage('角色已存在!')
      }

      await admin_role.create({
        role_name,
        role_description
      })

      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${role_name}’角色`
      })

      await admin_resJson(ctx, {
        state: 'success',
        message: '角色创建成功'
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
   * 修改角色
   * @param   {object} ctx 上下文对象
   */
  static async editAdminRole (ctx) {
    const req_data = ctx.request.body
    try {
      await admin_role.update(
        {
          role_name: req_data.role_name,
          role_description: req_data.role_description
        },
        {
          where: {
            role_id: req_data.role_id // 查询条件
          }
        }
      )

      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${req_data.role_id}’的角色为‘${req_data.role_name}’`
      })

      await admin_resJson(ctx, {
        state: 'success',
        message: '修改角色成功'
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
   * 删除角色
   * @param   {object} ctx 上下文对象
   */
  static async deleteAdminRole (ctx) {
    const { role_id } = ctx.request.body
    /* 角色与用户权限无关联的时候 */
    try {
      await admin_role.destroy({ where: { role_id } })
      await admin_resJson(ctx, {
        state: 'success',
        message: '删除角色成功'
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
   * 获取角色列表
   * @param   {object} ctx 上下文对象
   */
  static async getAdminRoleList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await admin_role.findAndCountAll({
        attributes: [
          'role_id',
          'role_name',
          'role_description',
          'admin_authority_ids'
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
          admin_role_list: rows
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
   * 获取全部角色
   * @param   {object} ctx 上下文对象
   */
  static async getAdminRoleAll (ctx) {
    try {
      let admin_role_findAll = await admin_role.findAll()
      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: admin_role_findAll
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
   * -----------------------------------权限操作--------------------------------
   * 创建权限
   * @param   {object} ctx 上下文对象
   */
  static async createAdminAuthority (ctx) {
    const req_data = ctx.request.body

    try {
      let find_authority_name = await admin_authority.findOne({
        where: { authority_name: req_data.authority_name }
      })
      if (find_authority_name) {
        throw new ErrorMessage('权限名已存在!')
      }
      let find_authority_url = await admin_authority.findOne({
        where: { authority_url: req_data.authority_url }
      })
      if (find_authority_url) {
        throw new ErrorMessage('权限路径已存在!')
      }

      await admin_authority.create({
        ...req_data
      })
      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${req_data.authority_name}’权限`
      })

      await admin_resJson(ctx, {
        state: 'success',
        message: '权限创建成功'
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
   * 获取权限列表
   * @param   {object} ctx 上下文对象
   */
  static async getAdminAuthorityList (ctx) {
    try {
      let admin_authority_findAll = await admin_authority.findAll()

      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: admin_authority_findAll
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
   * 修改权限
   * @param   {object} ctx 上下文对象
   */
  static async updateAdminAuthority (ctx) {
    const req_data = ctx.request.body
    try {
      await admin_authority.update(
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
      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${req_data.authority_id}’的权限为‘${req_data.authority_name}’`
      })

      admin_resJson(ctx, {
        state: 'success',
        message: '更新权限成功'
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
   * 删除权限列表
   * @param   {object} ctx 上下文对象
   */
  static async deleteAdminAuthority (ctx) {
    const { authority_id_arr } = ctx.request.body
    try {
      await admin_authority.destroy({
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
      return false
    }
  }

  /**
   * 创建用户角色关联
   * @param   {object} ctx 上下文对象
   */
  static async createAdminUserRole (ctx) {
    const req_data = ctx.request.body
    try {
      await admin_user.update(
        {
          admin_role_ids: req_data.role_id
        },
        {
          where: {
            uid: req_data.uid // 查询条件
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
      return false
    }
  }

  /**
   * 设置角色权限关联
   * @param   {object} ctx 上下文对象
   */

  static async setAdminRoleAuthority (ctx) {
    const req_data = ctx.request.body
    try {
      await admin_role.update(
        { admin_authority_ids: req_data.role_authority_list_all.join(',') },
        {
          where: { role_id: req_data.role_id } // 查询条件
        }
      )
      await admin_resJson(ctx, {
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

module.exports = role_authority
