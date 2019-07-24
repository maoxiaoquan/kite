const { sequelize, article_column } = require('../../../db/mysqldb/index')
const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const moment = require('moment')
const { create_admin_system_log } = require('./adminSystemLog')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Article_Column {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {object} ctx 上下文对象
   */
  static async createArticleColumn (ctx) {
    const req_data = ctx.request.body

    try {
      let find_article_column_name = await article_column.findOne({
        where: { article_column_name: req_data.article_column_name }
      })
      if (find_article_column_name) {
        throw new ErrorMessage('专栏名已存在!')
      }
      let find_article_column_en_name = await article_column.findOne({
        where: { article_column_en_name: req_data.article_column_en_name }
      })
      if (find_article_column_en_name) {
        throw new ErrorMessage('专栏英文名已存在!')
      }

      await article_column.create({
        ...req_data,
        article_tag_ids: req_data.article_tag_ids.join(',')
      })

      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 3,
        content: `成功创建了‘${req_data.article_column_name}’文章专栏`
      })

      admin_resJson(ctx, {
        state: 'success',
        message: '专栏创建成功'
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
   * 获取标签列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleColumnList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await article_column.findAndCountAll({
        attributes: [
          'article_column_id',
          'article_column_name',
          'article_column_en_name',
          'article_column_icon',
          'article_tag_ids',
          'article_column_description',
          'sort',
          'is_home',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [
          ['sort', 'ASC'] // asc
        ]
      })
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
      return false
    }
  }

  /**
   * 更新标签
   * @param   {object} ctx 上下文对象
   */
  static async updateArticleColumn (ctx) {
    const req_data = ctx.request.body
    try {
      await article_column.update(
        {
          ...req_data,
          article_tag_ids: req_data.article_tag_ids.join(',')
        },
        {
          where: {
            article_column_id: req_data.article_column_id // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新专栏成功'
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
   * 删除标签
   */
  static async deleteArticleColumn (ctx) {
    const { article_column_id } = ctx.request.body

    await article_column
      .destroy({ where: { article_column_id } })
      .then(data => {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除专栏成功'
        })
      })
      .catch(err => {
        console.log('failed: ' + err)
        admin_resJson(ctx, {
          state: 'error',
          message: '删除专栏失败'
        })
      })
  }
}

module.exports = Article_Column
