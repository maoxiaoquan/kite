const models = require('../../db/mysqldb')
const { sign_resJson, admin_resJson } = require('../utils/res_data')
const {
  tools: { encrypt }
} = require('../utils')
const config = require('../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class Comment {
  constructor() {}
  /**
   * 获取标分页评论列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_comment_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await models.comment.findAndCountAll({
      where: '', //为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize) //每页限制返回的数据条数
    })
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
   * 更新评论
   * @param   {obejct} ctx 上下文对象
   */
  static async update_comment(ctx) {
    const req_data = ctx.request.body
    await await models.comment
      .update(
        {
          status: req_data.status
        },
        {
          where: {
            id: req_data.id //查询条件
          }
        }
      )
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '更新用户标签成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '更新用户标签失败'
        })
      })
  }

  /**
   * 删除评论
   */
  static async delete_comment(ctx) {
    const { id } = ctx.request.body

    let find_comment = await models.comment.findOne({ where: { id } })
    await models.comment
      .destroy({ where: { id } })
      .then(async function(p) {
        await models.article.update(
          {
            // 更新文章评论数
            comment_count: await models.comment.count({
              where: { aid: find_comment.aid, parent_id: 0 }
            })
          },
          { where: { aid: find_comment.aid } }
        )

        admin_resJson(ctx, {
          state: 'success',
          message: '删除用户评论成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除用户评论失败'
        })
      })
  }
}

module.exports = Comment
