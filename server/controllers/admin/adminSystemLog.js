const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')

class AdminSystemLog {
  /**
   * 创建后台日志
   * @param   {object} ctx 上下文对象
   */

  static async createAdminSystemLog ({ uid, type = 1, content }) {
    return models.system_log.create({
      uid,
      type,
      content
    })
  }

  /**
   * 获取后台系统日志操作
   * @param   {object} ctx 上下文对象
   */
  static async getAdminSystemLogList (req, res, next) {
    const { page = 1, pageSize = 10 } = req.params
    try {
      let { count, rows } = await models.system_log.findAndCountAll({
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date)
            .format('YYYY-MM-DD H:m:s')
            .toLocaleString()
        )
        rows[i].setDataValue(
          'admin_user',
          await models.admin_user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'nickname']
          })
        )
      }
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除后台系统日志
   */
  static async deleteAdminSystemLog (req, res, next) {
    const { id } = req.body
    try {
      await models.system_log.destroy({ where: { id } })
      await resAdminJson(res, {
        state: 'success',
        message: '删除后台系统日志成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = AdminSystemLog
