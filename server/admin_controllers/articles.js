const { sequelize, user, article } = require('../../db/mysqldb')
const { sign_resJson, admin_resJson } = require('../utils/res_data')
const {
  tools: { encrypt }
} = require('../utils')
const config = require('../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')

class Articles {
  constructor() {}

  /**
   * 获取用户列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await article.findAndCountAll({
      attributes: [
        'aid',
        'create_date',
        'content',
        'title',
        'excerpt',
        'source',
        'status',
        'type',
        'read_count'
      ],
      where: '', //为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize), //每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
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
   * 更新文章
   * @param   {obejct} ctx 上下文对象
   */
  static async edit_article(ctx) {
    const { aid, status, type, source } = ctx.request.body

    await article
      .update(
        {
          status,
          type,
          source
        },
        {
          where: {
            aid: aid //查询条件
          }
        }
      )
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '更新文章成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '更新文章失败'
        })
      })
  }

  /**
   * 删除文章
   * @param   {obejct} ctx 上下文对象
   * 删除文章判断是否有文章
   * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
   */
  static async delete_article(ctx) {
    const { aid } = ctx.request.body

    let find_article = await article.findOne({ where: { aid } })

    await article
      .destroy({ where: { aid } })
      .then(function(p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除文章成功'
        })
      })
      .catch(function(err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除文章失败'
        })
      })
  }
}

module.exports = Articles
