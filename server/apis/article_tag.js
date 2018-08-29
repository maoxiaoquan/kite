const {sequelize, article_tag} = require('../models')
const {format_login, format_data} = require('../utils/res_data')
const {tools: {encrypt}} = require('../utils')
const config = require('../../config')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Article_Tag {
  constructor () { }

  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {obejct} ctx 上下文对象
   */
  static async create_article_tag (ctx) {

    const req_data = ctx.request.body

    try {
      let find_article_tag_name = await article_tag.findOne({where: {article_tag_name: req_data.article_tag_name}})
      if (find_article_tag_name) {
        throw new err_mess('标签名已存在!')
      }
      let find_article_tag_us_name = await article_tag.findOne({where: {article_tag_us_name: req_data.article_tag_us_name}})
      if (find_article_tag_us_name) {
        throw new err_mess('标签名英文已存在!')
      }
    } catch (err) {
      format_data(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    await article_tag.create({
      article_tag_name: req_data.article_tag_name,
      article_tag_us_name: req_data.article_tag_us_name,
      article_tag_icon: req_data.article_tag_icon,
      article_tag_icon_type: req_data.article_tag_icon_type,
      article_tag_description: req_data.article_tag_description,
      create_date: moment().utc().utcOffset(+8).format('YYYY-MM-DD'), /*时间*/
      create_date_timestamp: moment().utc().utcOffset(+8).format('X'), /*时间戳 */
      enable: req_data.enable
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '标签创建成功'
      })
    }).catch(function (err) {
      console.log('failed: ' + err)
      format_data(ctx, {
        state: 'error',
        message: '标签创建出错'
      })
    })

  }

  /**
   * 获取标签列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article_tag_list (ctx) {
    const {page = 1, pageSize = 10} = ctx.query
    let {count, rows} = await article_tag.findAndCountAll({
      attributes: ['article_tag_id', 'article_tag_name', 'article_tag_us_name', 'article_tag_icon', 'article_tag_icon_type', 'article_tag_description', 'enable'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: count,
        list: rows
      }
    })
  }

  /**
   * 获取所有标签操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article_tag_all (ctx) {
    let article_tag_all = await article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name', 'article_tag_us_name', 'article_tag_icon', 'article_tag_icon_type', 'article_tag_description', 'enable'],
      where: {enable: 1}//为空，获取全部，也可以自己添加条件
    })
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        article_tag_all: article_tag_all
      }
    })
  }

  /**
   * 更新标签
   * @param   {obejct} ctx 上下文对象
   */
  static async update_article_tag (ctx) {
    const req_data = ctx.request.body
    await article_tag.update({
      article_tag_name: req_data.article_tag_name,
      article_tag_us_name: req_data.article_tag_us_name,
      article_tag_icon: req_data.article_tag_icon,
      article_tag_icon_type: req_data.article_tag_icon_type,
      article_tag_description: req_data.article_tag_description,
      enable: req_data.enable
    }, {
      where: {
        article_tag_id: req_data.article_tag_id//查询条件
      }
    })
      .then(function (p) {
        format_data(ctx, {
          state: 'success',
          message: '更新标签成功'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '更新标签失败'
        })
      })
  }

  /**
   * 删除标签
   */
  static async delete_article_tag (ctx) {

    const {article_tag_id} = ctx.request.body

    await article_tag.destroy({'where': {article_tag_id}})
      .then(function (p) {
        format_data(ctx, {
          state: 'success',
          message: '删除用户成功'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除用户失败'
        })
      })

  }

}

module.exports = Article_Tag