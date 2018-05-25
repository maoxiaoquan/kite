const {format_data} = require('../utils/res_data')
const {ad_role, ad_authority} = require('../db/db')
const tokens = require('../utils/tokens')

class role_authority {
  constructor () {
    // super()
  }

  /**
   * 创建角色
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_role (ctx) {

    const req_data = ctx.request.body

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
   * 获取角色列表
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_role_list (ctx) {
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
   * 创建权限
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_authority (ctx) {

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
    }

    await ad_authority.create({
      authority_name: req_data.authority_name,
      authority_type: req_data.authority_type,
      authority_parent_id: req_data.authority_parent_id,
      authority_url: req_data.authority_url,
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

}

module.exports = role_authority