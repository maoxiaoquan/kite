const { resAdminJson } = require('../../utils/resData')
const models = require('../../../../db/mysqldb/index')
const { createAdminSystemLog } = require('./adminSystemLog')
const Op = require('sequelize').Op


class adminRoleAuthority {
  /**
   * -----------------------------------角色操作--------------------------------
   * 创建角色
   * @param   {object} ctx 上下文对象
   */
  static async createAdminRole(req: any, res: any, next: any) {
    const { role_name, role_description } = req.body
    try {
      if (!role_name) {
        throw new Error('请输入角色名!')
      }
      if (!role_description) {
        throw new Error('请输入角色介绍!')
      }
      let oneAdminRole = await models.admin_role.findOne({
        where: { role_name }
      })
      if (oneAdminRole) {
        throw new Error('角色已存在!')
      }

      await models.admin_role.create({
        role_name,
        role_description
      })

      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功创建了‘${role_name}’角色`
      })

      await resAdminJson(res, {
        state: 'success',
        message: '角色创建成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async editAdminRole(req: any, res: any, next: any) {
    const reqData = req.body
    try {
      let oneAdminRole = await models.admin_role.findOne({
        where: {
          role_name: reqData.role_name,
          role_id: {
            [Op.ne]: reqData.role_id
          }
        }
      })

      if (oneAdminRole) {
        throw new Error('角色名字已存在，请重新输入')
      }

      await models.admin_role.update(
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
        uid: req.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.role_id}’的角色为‘${reqData.role_name}’`
      })

      await resAdminJson(res, {
        state: 'success',
        message: '修改角色成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async deleteAdminRole(req: any, res: any, next: any) {
    const { role_id } = req.body
    /* 角色与用户权限无关联的时候 */
    try {
      await models.admin_role.destroy({ where: { role_id } })
      await resAdminJson(res, {
        state: 'success',
        message: '删除角色成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async getAdminRoleList(req: any, res: any, next: any) {
    const { page = 1, pageSize = 10 } = req.query
    try {
      let { count, rows } = await models.admin_role.findAndCountAll({
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
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          admin_role_list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async getAdminRoleAll(req: any, res: any, next: any) {
    try {
      let adminRoleAll = await models.admin_role.findAll()
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: adminRoleAll
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async createAdminAuthority(req: any, res: any, next: any) {
    const reqData = req.body

    try {
      let oneAdminAuthorityName = await models.admin_authority.findOne({
        where: { authority_name: reqData.authority_name }
      })
      if (oneAdminAuthorityName) {
        throw new Error('权限名已存在!')
      }
      let oneAdminAuthorityUrl = await models.admin_authority.findOne({
        where: { authority_url: reqData.authority_url }
      })
      if (oneAdminAuthorityUrl) {
        throw new Error('权限路径已存在!')
      }

      await models.admin_authority.create({
        ...reqData
      })
      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功创建了‘${reqData.authority_name}’权限`
      })

      await resAdminJson(res, {
        state: 'success',
        message: '权限创建成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async getAdminAuthorityList(req: any, res: any, next: any) {
    try {
      let adminAuthorityAll = await models.admin_authority.findAll()

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: adminAuthorityAll
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async updateAdminAuthority(req: any, res: any, next: any) {
    const reqData = req.body
    try {
      await models.admin_authority.update(
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
        uid: req.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.authority_id}’的权限为‘${reqData.authority_name}’`
      })

      resAdminJson(res, {
        state: 'success',
        message: '更新权限成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async deleteAdminAuthority(req: any, res: any, next: any) {
    const { authority_id_arr } = req.body
    try {
      await models.admin_authority.destroy({
        where: { authority_id: { [Op.in]: authority_id_arr } }
      })
      resAdminJson(res, {
        state: 'success',
        message: '删除权限树成功'
      })
    } catch (err) {
      resAdminJson(res, {
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
  static async createAdminUserRole(req: any, res: any, next: any) {
    const reqData = req.body
    try {
      await models.admin_user.update(
        {
          admin_role_ids: reqData.role_id
        },
        {
          where: {
            uid: reqData.uid // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新用户角色成功'
      })
    } catch (err) {
      resAdminJson(res, {
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

  static async setAdminRoleAuthority(req: any, res: any, next: any) {
    const reqData = req.body
    try {
      await models.admin_role.update(
        { admin_authority_ids: reqData.role_authority_list_all.join(',') },
        {
          where: { role_id: reqData.role_id } // 查询条件
        }
      )
      await resAdminJson(res, {
        state: 'success',
        message: '修改成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

export default adminRoleAuthority
