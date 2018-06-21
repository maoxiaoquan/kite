const { format_data } = require('../utils/res_data')
const {
  sequelize,
  admin_role,
  admin_authority,
  admin_user_role, admin_role_authority } = require('../models')

const { isEmpty } = require('../utils/tools')


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
    const { role_name, role_description } = ctx.request.body
    try {
      if (!role_name) {
        throw new err_mess('请输入角色名!')
      }
      if (!role_description) {
        throw new err_mess('请输入角色介绍!')
      }
      let find_role = await admin_role.findOne({ where: { role_name } })
      if (find_role) {
        throw new err_mess('角色已存在!')
      }
    } catch (err) {
      format_data(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    await admin_role.create({ role_name, role_description })
      .then(function (p) {
        format_data(ctx, {
          state: 'success',
          message: '角色创建成功'
        })
      }).catch(function (err) {
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
    await admin_role.update({
      role_name: req_data.role_name,
      role_description: req_data.role_description
    }, {
        where: {
          role_id: req_data.role_id//查询条件
        }
      })
      .then(function (p) {
        format_data(ctx, {
          state: 'success',
          message: '修改角色成功'
        })
      }).catch(function (err) {
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


    const { role_id } = ctx.request.body

    let find_user_role = await admin_user_role.findOne({ where: { role_id } })
    let find_role_authority = await admin_role_authority.findOne({ where: { role_id } })

    if (!find_user_role && !find_role_authority) {  /* 角色与用户权限无关联的时候 */
      await admin_role.destroy({ 'where': { role_id } })
        .then(function (p) {
          format_data(ctx, {
            state: 'success',
            message: '删除角色成功'
          })
        }).catch(function (err) {
          format_data(ctx, {
            state: 'error',
            message: '删除角色失败'
          })
        })
    } else if (find_user_role && find_role_authority) {
      await sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return admin_role.destroy({ 'where': { role_id } }, { ...transaction }) /* 先删除角色权限 */
          .then(function (delete_admin_authority) {
            return admin_user_role.destroy({ 'where': { role_id } }, { transaction })/* 再删除用户角色关联 */
              .then(function (delete_admin_authority) {
                return admin_role_authority.destroy({ 'where': { role_id } }, { transaction })/* 再删除权限角色表权限角色关联 */
              });
          });

      }).then(function (results) {
        format_data(ctx, {
          state: 'success',
          message: '删除角色,同时删除权限用户角色关联'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除角色失败,同时回滚所有操作'
        })
      });
    } else if (find_user_role) {
      await sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return admin_role.destroy({ 'where': { role_id } }, { ...transaction }) /* 先删除角色权限 */
          .then(function (delete_admin_authority) {
            return admin_user_role.destroy({ 'where': { role_id } }, { transaction })/* 再删除用户角色关联 */
          });

      }).then(function (results) {
        format_data(ctx, {
          state: 'success',
          message: '删除角色,同时删除用户角色关联'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除角色失败,同时回滚所有操作'
        })
      });
    } else if (find_role_authority) {
      await sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return admin_role.destroy({ 'where': { role_id } }, { ...transaction }) /* 先删除角色权限 */
          .then(function (delete_admin_authority) {
            return admin_role_authority.destroy({ 'where': { role_id } }, { transaction })/* 再删除用户角色关联 */
          });

      }).then(function (results) {
        format_data(ctx, {
          state: 'success',
          message: '删除角色,同时删除权限角色关联'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除角色失败,同时回滚所有操作'
        })
      });
    }

  }

  /**
   * 获取角色列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_role_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await admin_role.findAndCountAll({
      attributes: ['role_id', 'role_name', 'role_description'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: count,
        admin_role_list: rows
      }
    })
  }

  /**
   * 获取全部角色
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_role_all(ctx) {
    let admin_role_findAll = await admin_role.findAll()
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: admin_role_findAll
    })
  }

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建权限
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_authority(ctx) {

    const req_data = ctx.request.body

    try {
      let find_authority_name = await admin_authority.findOne({ where: { authority_name: req_data.authority_name } })
      if (find_authority_name) {
        throw new err_mess('权限名已存在!')
      }
      let find_authority_url = await admin_authority.findOne({ where: { authority_url: req_data.authority_url } })
      if (find_authority_url) {
        throw new err_mess('权限路径已存在!')
      }
    } catch (err) {
      format_data(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    await admin_authority.create({
      authority_name: req_data.authority_name,
      authority_type: req_data.authority_type,
      authority_parent_id: req_data.authority_parent_id,
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

    let admin_authority_findAll = await admin_authority.findAll()

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: admin_authority_findAll
    })

  }



  /**
   * 修改权限
   * @param   {obejct} ctx 上下文对象
   */
  static async update_admin_authority(ctx) {
    const req_data = ctx.request.body
    await admin_authority.update({
      authority_name: req_data.authority_name,
      authority_type: req_data.authority_type,
      authority_url: req_data.authority_url,
      authority_sort: req_data.authority_sort,
      authority_description: req_data.authority_description
    }, {
        where: {
          authority_id: req_data.authority_id//查询条件
        }
      })
      .then(function (p) {
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

    const { authority_id_arr } = ctx.request.body
    
    let find_admin_role_authority = await admin_role_authority.findAll({ 'where': { 'authority_id': { in: authority_id_arr } } })

    if (!isEmpty(find_admin_role_authority)) {/* 如果存在则走事务删除所有与之关联的角色权限表的关联 */
      // 创建事务
      await sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return admin_authority.destroy({ 'where': { 'authority_id': { in: authority_id_arr } } }, { ...transaction }) /* 先删除权限表权限 */
          .then(function (delete_admin_authority) {
            return admin_role_authority.destroy({ 'where': { 'authority_id': { in: authority_id_arr } } }, { ...transaction })/* 再删除权限角色表权限角色关联 */
          });

      }).then(function (results) {
        format_data(ctx, {
          state: 'success',
          message: '删除权限树,同时删除权限角色关联'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除权限树成功,同时回滚所有操作'
        })
      });

    } else {
      await admin_authority.destroy({ 'where': { 'authority_id': { in: authority_id_arr } } })
      format_data(ctx, {
        state: 'success',
        message: '删除权限树成功'
      })
    }
  }

  /**
   * -----------------------------------角色权限操作--------------------------------
   * 获取用户角色列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_user_role_all(ctx) {

    let admin_user_role_findAll = await admin_user_role.findAll()

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: admin_user_role_findAll
    })

  }

  /**
   * 创建用户角色关联
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_user_role(ctx) {

    const req_data = ctx.request.body

    let find_role = await admin_user_role.findOne({
      where: {
        uid: req_data.uid
      }
    })

    if (find_role) {

      await admin_user_role.update({
        role_id: req_data.role_id
      }, {
          where: {
            uid: req_data.uid//查询条件
          }
        }).then(function (p) {
          console.log('created.' + JSON.stringify(p))
          format_data(ctx, {
            state: 'success',
            message: '更新用户角色成功'
          })
        }).catch(function (err) {
          console.log('failed: ' + err)
          format_data(ctx, {
            state: 'error',
            message: '更新用户角色失败'
          })
        })

    } else {
      await admin_user_role.create({
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
   * 获取角色权限关联
   * @param   {obejct} ctx 上下文对象
   */

  static async get_admin_role_authority(ctx) {
    const res_data = ctx.query
    let authority_id_arr = []
    let admin_role_authority_findAll = await admin_role_authority.findAll({
      where: {
        role_id: res_data.role_id
      }
    })

    admin_role_authority_findAll.map(item => {
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
    await admin_role_authority.destroy({ 'where': { role_id: req_data.role_id } })

    for (let i in req_data.role_authority_list) {
      await admin_role_authority.create({ role_id: req_data.role_id, authority_id: req_data.role_authority_list[i], authority_toggle: true })
    }

    format_data(ctx, {
      state: 'success',
      message: '修改成功',
      data: ''
    })
  }

}

module.exports = role_authority