const models = require('../models')
const moment = require('moment')
const {render, home_resJson} = require('../utils/res_data')
const Op = require('sequelize').Op

class Index {
  constructor (state) {
    this.state = {
      title: '333'
    }
  }

  static async render_get_index (ctx) {

    let page = 1
    let pageSize = 25
    const title = 'home'

    let column_id = ctx.params.column_id || 'all'

    let find_article_column = await models.article_column.findOne({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type', 'article_column_tags'],
      where: {article_column_id: column_id}//为空，获取全部，也可以自己添加条件
    })

    let current_article_tags = find_article_column ? find_article_column.article_column_tags.split(',') : ''

    let where_params = !find_article_column ? '' : {article_tag_ids: {[Op.regexp]: `^[${current_article_tags.join('|')}]`}}

    let {count, rows} = await models.article.findAndCountAll({
      where: where_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
      /*include: [{model: models.user, as: 'user', attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']}]*/
    }).then((res) => {
      res.rows.map((item, key) => {
        item.create_at = moment(item.create_date).format('YYYY-MM-DD')
        return item
      })
      return res
    })

    /*所有文章专题*/
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    let article_column = await models.article_column.findAll({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type'],
      where: {enable: 1},//为空，获取全部，也可以自己添加条件
      limit: 10
    })

    for (let item in rows) { // 循环取用户
      await (async (i) => {
        rows[i].user = {}
        let data = await models.user.findOne({
          where: {uid: rows[i].uid},
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        }).then((res) => {
          return JSON.parse(JSON.stringify(res))
        })
        if (data) {
          rows[i].user = data
        }
      })(item)
    }

    await render(ctx, {
      title: title,
      view_url: 'default/index',
      state: 'success',
      message: 'home',
      data: {
        count: count,
        article_list: rows,
        article_column: article_column,
        tag_all: article_tag_all,
        current_page: column_id === 'all' ? 'index' : find_article_column.article_column_name,
        column_id: column_id
      }
    })
  }

  static async get_index (ctx) {

    let column_id = ctx.query.column_id || 'all'
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let find_article_column = await models.article_column.findOne({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type', 'article_column_tags'],
      where: {article_column_id: column_id}//为空，获取全部，也可以自己添加条件
    })
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    let current_article_tags = find_article_column ? find_article_column.article_column_tags.split(',') : ''

    let find_params = !find_article_column ? '' : {article_tag_ids: {[Op.regexp]: `^[${current_article_tags.join('|')}]`}}

    let {count, rows} = await models.article.findAndCountAll({
      where: find_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    }).then((res) => {
      res.rows.map((item, key) => {
        item.create_at = moment(item.create_date).format('YYYY-MM-DD')
        return item
      })
      return res
    })


    for (let item in rows) { // 循环取用户
      await (async (i) => {
        rows[i].user = {}
        let data = await models.user.findOne({
          where: {uid: rows[i].uid},
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        }).then((res) => {
          return JSON.parse(JSON.stringify(res))
        })
        if (data) {
          rows[i].user = data
        }
      })(item)
    }

    if (rows) {
      home_resJson(ctx, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count,
          article_list: rows,
          column_id,
          page,
          pageSize,
          article_tag: article_tag_all
        }
      })
    } else {
      home_resJson(ctx, {
        state: 'error',
        message: '数据返回错误，请再次刷新尝试'
      })
    }
  }

  static async no_found_404 (ctx) {
    const title = '404'
    await render(ctx, {
      title: title,
      view_url: 'default/404',
      state: 'success',
      message: '404 页面'
    })
  }

}

module.exports = Index
