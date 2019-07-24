const { user, article } = require('../../../db/mysqldb/index')
const { admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const moment = require('moment')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Articles {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleList (ctx) {
    const {
      page = 1,
      pageSize = 10,
      title,
      source,
      status,
      type
    } = ctx.request.body

    let where_params = {} // 定义查询条件

    title && (where_params['title'] = { [Op.like]: `%${title}%` })
    source && (where_params['source'] = source)
    status && (where_params['status'] = status)
    type && (where_params['type'] = type)

    console.log('where_params', where_params)
    try {
      let { count, rows } = await article.findAndCountAll({
        attributes: [
          'uid',
          'aid',
          'create_date',
          'content',
          'title',
          'excerpt',
          'source',
          'status',
          'type',
          'read_count',
          'comment_count',
          'rejection_reason'
        ],
        where: where_params, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_at',
          await moment(rows[i].create_date)
            .format('YYYY-MM-DD H:m:s')
            .toLocaleString()
        )
        rows[i].setDataValue(
          'user',
          await user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 更新文章
   * @param   {object} ctx 上下文对象
   */
  static async editArticle (ctx) {
    const { aid, status, type, source, rejection_reason } = ctx.request.body
    try {
      await article.update(
        {
          status,
          type,
          source,
          rejection_reason
        },
        {
          where: {
            aid: aid // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新文章成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除文章
   * @param   {object} ctx 上下文对象
   * 删除文章判断是否有文章
   * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
   */
  static async deleteArticle (ctx) {
    const { aid } = ctx.request.body
    try {
      let find_article = await article.findOne({ where: { aid } })
      if (find_article) {
        await article.destroy({ where: { aid } })
        admin_resJson(ctx, {
          state: 'success',
          message: '删除文章成功'
        })
      } else {
        throw new ErrorMessage('删除文章失败!')
      }
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Articles
