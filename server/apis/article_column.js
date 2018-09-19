const {sequelize, article_column} = require('../models')
const {sign_resJson, admin_resJson} = require('../utils/res_data')
const {tools: {encrypt}} = require('../utils')
const config = require('../../config')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Article_Column {
  constructor () { }

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {obejct} ctx 上下文对象
   */
  static async create_article_column (ctx) {

    const req_data = ctx.request.body

    try {
      let find_article_column_name = await article_column.findOne({where: {article_column_name: req_data.article_column_name}})
      if (find_article_column_name) {
        throw new err_mess('专栏名已存在!')
      }
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    console.log('req_data.article_column_tags', req_data.article_column_tags)

    await article_column.create({
      article_column_name: req_data.article_column_name,
      article_column_icon: req_data.article_column_icon,
      article_column_icon_type: req_data.article_column_icon_type,
      article_column_tags: req_data.article_column_tags.join(','),
      article_column_description: req_data.article_column_description,
      create_date: moment().utc().utcOffset(+8).format('X'),
      enable: req_data.enable
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      admin_resJson(ctx, {
        state: 'success',
        message: '专栏创建成功'
      })
    }).catch(function (err) {
      console.log('failed: ' + err)
      admin_resJson(ctx, {
        state: 'error',
        message: '专栏创建出错'
      })
    })

  }

  /**
   * 获取标签列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article_column_list (ctx) {
    const {page = 1, pageSize = 10} = ctx.query
    let {count, rows} = await article_column.findAndCountAll({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type', 'article_column_tags', 'article_column_description', 'enable'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
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
   * 更新标签
   * @param   {obejct} ctx 上下文对象
   */
  static async update_article_column (ctx) {
    const req_data = ctx.request.body
    await article_column.update({
      article_column_name: req_data.article_column_name,
      article_column_icon: req_data.article_column_icon,
      article_column_icon_type: req_data.article_column_icon_type,
      article_column_tags: req_data.article_column_tags.join(','),
      article_column_description: req_data.article_column_description,
      enable: req_data.enable
    }, {
      where: {
        article_column_id: req_data.article_column_id//查询条件
      }
    })
      .then(function (p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '更新专栏成功'
        })
      }).catch(function (err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '更新专栏失败'
        })
      })
  }

  /**
   * 删除标签
   */
  static async delete_article_column (ctx) {

    const {article_column_id} = ctx.request.body

    await article_column.destroy({'where': {article_column_id}})
      .then(function (p) {
        admin_resJson(ctx, {
          state: 'success',
          message: '删除专栏成功'
        })
      }).catch(function (err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '删除专栏失败'
        })
      })

  }

}

module.exports = Article_Column