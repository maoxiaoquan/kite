const { format_data } = require('../utils/res_data')
const { ad_role, ad_authority, ad_user_role, ad_role_authority } = require('../db/db')
const tokens = require('../utils/tokens')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class role_authority {
  constructor() {
    // super()
  }

  /**
   * -----------------------------------角色操作--------------------------------
   * 创建角色
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_role(ctx) {

    const req_data = ctx.request.body

    try {
      if (!req_data.role_name) {
        throw new err_mess('请输入角色名!')
      }

      if (!req_data.role_description) {
        throw new err_mess('请输入角色介绍!')
      }

    } catch (err) {

      format_data(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    let find_role = await ad_role.findOne({
      where: {
        role_name: req_data.role_name
      }
    })

    if (find_role) {
      format_data(ctx, {
        state: 'error',
        message: '角色已存在'
      })
    }

    await ad_role.create({
      role_name: req_data.role_name,
      role_description: req_data.role_description
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '角色创建成功'
      })
    }).catch(function (err) {
      console.log('failed: ' + err)
      format_data(ctx, {
        state: 'error',
        message: '角色创建出错'
      })
    })
  }

  /**
   * 修改角色
   * @param   {obejct} ctx 上下文对象
   */
  static async edit_admin_role(ctx) {
    const req_data = ctx.request.body

    console.log('req_data', req_data)

    await ad_role.update({
      role_name: req_data.role_name,
      role_description: req_data.role_description
    }, {
        where: {
          role_id: req_data.role_id//查询条件
        }
      }).then(function (p) {
        console.log('update.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '修改角色成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '修改角色失败'
        })
      })
  }


  /**
   * 删除角色
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_admin_role(ctx) {

    const req_data = ctx.request.body
    await ad_role.destroy({ 'where': { 'role_id': req_data.role_id } })
      .then(function (p) {
        console.log('created.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '删除角色成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '删除角色失败'
        })
      })

  }

  /**
   * 获取角色列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_role_list(ctx) {
    const res_data = ctx.query
    let page = res_data.page || 1
    let pageSize = res_data.pageSize || 10

    let ad_role_findAndCountAll = await ad_role.findAndCountAll({
      attributes: ['role_id', 'role_name', 'role_description'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: ad_role_findAndCountAll.count,
        admin_role_list: ad_role_findAndCountAll.rows
      }
    })
  }

  /**
   * 获取全部角色
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_role_all(ctx) {
    let ad_role_findAll = await ad_role.findAll()
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: ad_role_findAll
    })
  }



  /**
   * -----------------------------------权限操作--------------------------------
   * 创建权限
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_authority(ctx) {

    const req_data = ctx.request.body
    let find_authority_name = await ad_authority.findOne({
      where: {
        authority_name: req_data.authority_name
      }
    })

    if (find_authority_name) {
      format_data(ctx, {
        state: 'error',
        message: '权限名已存在'
      })
      return false
    }

    let find_authority_url = await ad_authority.findOne({
      where: {
        authority_url: req_data.authority_url
      }
    })

    if (find_authority_url) {
      format_data(ctx, {
        state: 'error',
        message: '权限路径已存在'
      })
      return false
    }

    await ad_authority.create({
      authority_name: req_data.authority_name,
      authority_type: req_data.authority_type,
      authority_parent_id: req_data.authority_parent_id,
      authority_parent_name: req_data.authority_parent_name,
      authority_url: req_data.authority_url,
      authority_sort: req_data.authority_sort,
      authority_description: req_data.authority_description
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '权限创建成功'
      })
    }).catch(function (err) {
      console.log('failed: ' + err)
      format_data(ctx, {
        state: 'error',
        message: '权限创建出错'
      })
    })

  }

  /**
   * 获取权限列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_authority_list(ctx) {

    let ad_authority_findAll = await ad_authority.findAll()

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: ad_authority_findAll
    })

  }



  /**
   * 修改权限
   * @param   {obejct} ctx 上下文对象
   */
  static async update_admin_authority(ctx) {
    const req_data = ctx.request.body
    await ad_authority.update({
      authority_name: req_data.authority_name,
      authority_type: req_data.authority_type,
      authority_url: req_data.authority_url,
      authority_sort: req_data.authority_sort,
      authority_description: req_data.authority_description
    }, {
        where: {
          authority_id: req_data.authority_id//查询条件
        }
      }).then(function (p) {
        console.log('update.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '更新权限成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '更新权限失败'
        })
      })
  }

  /**
   * 删除权限列表
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_admin_authority(ctx) {

    const req_data = ctx.request.body
    let ad_authority_destroy = await ad_authority.destroy({ 'where': { 'authority_id': { in: req_data.authority_id_arr } } })

    format_data(ctx, {
      state: 'success',
      message: '删除成功',
      data: ad_authority_destroy
    })
  }

  /**
   * -----------------------------------角色权限操作--------------------------------
   * 获取用户角色列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_user_role_all(ctx) {

    let ad_user_role_findAll = await ad_user_role.findAll()

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: ad_user_role_findAll
    })

  }

  /**
   * 创建用户角色关联
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_user_role(ctx) {

    const req_data = ctx.request.body

    let find_role = await ad_user_role.findOne({
      where: {
        uid: req_data.uid
      }
    })

    if (find_role) {

      await ad_user_role.update({
        role_id: req_data.role_id
      }, {
          where: {
            uid: req_data.uid//查询条件
          }
        }).then(function (p) {
          console.log('created.' + JSON.stringify(p))
          format_data(ctx, {
            state: 'success',
            message: '更新角色成功'
          })
        }).catch(function (err) {
          console.log('failed: ' + err)
          format_data(ctx, {
            state: 'error',
            message: '更新角色失败'
          })
        })

    } else {
      await ad_user_role.create({
        uid: req_data.uid,
        role_id: req_data.role_id
      }).then(function (p) {
        console.log('created.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '用户角色关联成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '用户角色关联出错'
        })
      })
    }
  }

  /**
   * 删除用户角色 传uid则是根绝uid删除当前角色用户关联 ，传role_id则是删除当前角色所有用户关联
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_admin_user_role(ctx) {

    const req_data = ctx.request.body

    if (req_data.uid) { // 根据用户uid删除用户角色关联

      let find_role = await ad_user_role.findOne({
        where: {
          uid: req_data.uid
        }
      })
      if (find_role) {
        let ad_user_role_destroy = await ad_user_role.destroy({ 'where': { uid: req_data.uid } })
        format_data(ctx, {
          state: 'success',
          message: '删除当前用户角色关联成功',
          data: ad_user_role_destroy
        })
      } else {
        format_data(ctx, {
          state: 'success',
          message: '当前用户无任何角色',
          data: ''
        })
      }

    } else if (req_data.role_id) { // 根据角色role_id删除用户角色关联

      let find_role = await ad_user_role.findOne({
        where: {
          role_id: req_data.role_id
        }
      })
      if (find_role) {
        let ad_role_user_destroy = await ad_user_role.destroy({ 'where': { role_id: req_data.role_id } })
        format_data(ctx, {
          state: 'success',
          message: '删除当前角色用户关联成功',
          data: ad_role_user_destroy
        })
      } else {
        format_data(ctx, {
          state: 'success',
          message: '当前角色无任何用户',
          data: ''
        })
      }

    } else {
      format_data(ctx, {
        state: 'success',
        message: '当前用户无任何角色,当前角色无任何用户关联',
        data: ''
      })
    }
  }

  /**
   * 获取角色权限关联
   * @param   {obejct} ctx 上下文对象
   */

  static async get_admin_role_authority(ctx) {
    const res_data = ctx.query
    let authority_id_arr = []
    let ad_role_authority_findAll = await ad_role_authority.findAll({
      where: {
        role_id: res_data.role_id
      }
    })

    ad_role_authority_findAll.map(item => {
      authority_id_arr.push(item.authority_id)
    })

    format_data(ctx, {
      state: 'success',
      message: '获取当前角色所有权限成功',
      data: authority_id_arr
    })
  }

  /**
   * 设置角色权限关联
   * @param   {obejct} ctx 上下文对象
   */

  static async set_admin_role_authority(ctx) {
    const req_data = ctx.request.body

    /*先delele后创建*/
    await ad_role_authority.destroy({ 'where': { role_id: req_data.role_id } })

    for (let i in req_data.role_authority_list) {
      await ad_role_authority.create({ role_id: req_data.role_id, authority_id: req_data.role_authority_list[i], authority_toggle: true })
    }

    format_data(ctx, {
      state: 'success',
      message: '修改成功',
      data: ''
    })
  }

  /**
   * 删除角色权限关联 传role_id则是根绝role_id删除当前角色权限关联 ，传authority_id则是删除当前权限所有角色关联
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_admin_role_authority(ctx) {

    const req_data = ctx.request.body

    if (req_data.role_id) { // 根据用户role_id删除角色权限关联

      let find_role_authority = await ad_role_authority.findOne({
        where: {
          role_id: req_data.role_id
        }
      })
      if (find_role_authority) {
        let ad_role_authority_destroy = await ad_role_authority.destroy({ 'where': { role_id: req_data.role_id } })
        format_data(ctx, {
          state: 'success',
          message: '删除当前角色权限关联成功',
          data: ad_role_authority_destroy
        })
      } else {
        format_data(ctx, {
          state: 'success',
          message: '当前角色无任何权限',
          data: ''
        })
      }

    } else if (req_data.authority_id_arr) { // 根据权限authority_id删除权限角色关联

      let ad_authority_role_destroy = await ad_role_authority.destroy({ 'where': { 'authority_id': { in: req_data.authority_id_arr } } })
      format_data(ctx, {
        state: 'success',
        message: '删除当前权限角色关联成功',
        data: ad_authority_role_destroy
      })

    } else {
      format_data(ctx, {
        state: 'success',
        message: '当前权限无任何角色,当前角色无任何权限关联',
        data: ''
      })
    }
  }

}

module.exports = role_authority