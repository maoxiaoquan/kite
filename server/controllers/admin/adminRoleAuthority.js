const { resAdminJson } = require('../../utils/resData')
const models = require('../../../db/mysqldb/index')
const { createAdminSystemLog } = require('./adminSystemLog')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class adminRoleAuthority {
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
      let oneAdminRole = await models.adminRole.findOne({
        where: { role_name }
      })
      if (oneAdminRole) {
        throw new ErrorMessage('角色已存在!')
      }

      await models.adminRole.create({
        role_name,
        role_description
      })

      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${role_name}’角色`
      })

      await resAdminJson(ctx, {
        state: 'success',
        message: '角色创建成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
    const reqData = ctx.request.body
    try {
      await models.adminRole.update(
        {
          role_name: reqData.role_name,
          role_description: reqData.role_description
        },
        {
          where: {
            role_id: reqData.role_id // 查询条件
          }
        }
      )

      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.role_id}’的角色为‘${reqData.role_name}’`
      })

      await resAdminJson(ctx, {
        state: 'success',
        message: '修改角色成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
      await models.adminRole.destroy({ where: { role_id } })
      await resAdminJson(ctx, {
        state: 'success',
        message: '删除角色成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
      let { count, rows } = await models.adminRole.findAndCountAll({
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
      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          admin_role_list: rows
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
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
      let adminRoleAll = await models.adminRole.findAll()
      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: adminRoleAll
      })
    } catch (err) {
      resAdminJson(ctx, {
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
    const reqData = ctx.request.body

    try {
      let oneAdminAuthorityName = await models.adminAuthority.findOne({
        where: { authority_name: reqData.authority_name }
      })
      if (oneAdminAuthorityName) {
        throw new ErrorMessage('权限名已存在!')
      }
      let oneAdminAuthorityUrl = await models.adminAuthority.findOne({
        where: { authority_url: reqData.authority_url }
      })
      if (oneAdminAuthorityUrl) {
        throw new ErrorMessage('权限路径已存在!')
      }

      await models.adminAuthority.create({
        ...reqData
      })
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${reqData.authority_name}’权限`
      })

      await resAdminJson(ctx, {
        state: 'success',
        message: '权限创建成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
      let adminAuthorityAll = await models.adminAuthority.findAll()

      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: adminAuthorityAll
      })
    } catch (err) {
      resAdminJson(ctx, {
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
    const reqData = ctx.request.body
    try {
      await models.adminAuthority.update(
        {
          authority_name: reqData.authority_name,
          authority_type: reqData.authority_type,
          authority_url: reqData.authority_url,
          authority_sort: reqData.authority_sort,
          authority_description: reqData.authority_description,
          enable: reqData.enable
        },
        {
          where: {
            authority_id: reqData.authority_id // 查询条件
          }
        }
      )
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.authority_id}’的权限为‘${reqData.authority_name}’`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '更新权限成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
      await models.adminAuthority.destroy({
        where: { authority_id: { [Op.in]: authority_id_arr } }
      })
      resAdminJson(ctx, {
        state: 'success',
        message: '删除权限树成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
    const reqData = ctx.request.body
    try {
      await models.adminUser.update(
        {
          admin_role_ids: reqData.role_id
        },
        {
          where: {
            uid: reqData.uid // 查询条件
          }
        }
      )
      resAdminJson(ctx, {
        state: 'success',
        message: '更新用户角色成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
    const reqData = ctx.request.body
    try {
      await models.adminRole.update(
        { admin_authority_ids: reqData.role_authority_list_all.join(',') },
        {
          where: { role_id: reqData.role_id } // 查询条件
        }
      )
      await resAdminJson(ctx, {
        state: 'success',
        message: '修改成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = adminRoleAuthority
