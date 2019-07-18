const models = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const moment = require('moment')
const Op = require('sequelize').Op
const { lowdb } = require('../../../db/lowdb/index')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Comment {
  /**
   * 获取标分页评论列表操作
   * @param   {object} ctx 上下文对象
   */
  static async get_system_info (ctx) {
    try {
      const email = lowdb
        .read()
        .get('email')
        .value()
      const website = lowdb
        .read()
        .get('website')
        .value()
      const config = lowdb
        .read()
        .get('config')
        .value()

      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          email: {
            ...email,
            pass: ''
          },
          website,
          config
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
   * 更新系统配置
   * @param   {object} ctx 上下文对象
   */
  static async update_system_info (ctx) {
    const { email, website, type, config } = ctx.request.body
    try {
      if (type === 'email') {
        await lowdb
          .get('email')
          .assign(email)
          .write()
      } else if (type === 'website') {
        await lowdb
          .get('website')
          .assign(website)
          .write()
      } else if (type === 'config') {
        await lowdb
          .get('config')
          .assign(config)
          .write()
      }
      admin_resJson(ctx, {
        state: 'success',
        message: '更新系统配置成功'
      })
    } catch (e) {
      admin_resJson(ctx, {
        state: 'error',
        message: '更新系统配置失败'
      })
    }
  }
}

module.exports = Comment
