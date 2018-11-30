const models = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../../config')
const moment = require('moment')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class AdminSystemLog {
  constructor() {}

  /**
   * 创建后台日志
   * @param   {obejct} ctx 上下文对象
   */

  static async create_admin_system_log({ uid, type = 1, content }) {
    await models.admin_system_log.create({
      uid,
      type,
      content
    })
  }

  /**
   * 获取后台系统日志操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_system_log_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await models.admin_system_log
      .findAndCountAll({
        where: '', //为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) //每页限制返回的数据条数
      })
      .then(res => {
        res.rows = JSON.parse(JSON.stringify(res.rows))
        return res
      })

    for (let item in rows) {
      // 循环取用户
      await (async i => {
        rows[i].admin_user = {}
        let data = await models.admin_user
          .findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'nickname']
          })
          .then(res => {
            return JSON.parse(JSON.stringify(res))
          })
        if (data) {
          rows[i].admin_user = data
        }
      })(item)
    }

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
   * 删除后台系统日志
   */
  static async delete_admin_system_log(ctx) {
    const { id } = ctx.request.body

    await models.admin_system_log
      .destroy({ where: { id } })
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除后台系统日志成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除后台系统日志失败'
        })
      })
  }
}

module.exports = AdminSystemLog
