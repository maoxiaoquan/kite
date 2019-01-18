const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, home_resJson } = require('../../utils/res_data')
const Op = require('sequelize').Op
const web_where = require('../../utils/web_where')

class Index {
  constructor(state) {
  }

  static async get_index(ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let column_id = ctx.query.column_id || ''
    let sort = ctx.query.sort || 'all'
    let where_params = {} // 查询参数
    let order_params = [] // 排序参数

    let find_article_column = await models.article_column.findOne({
      attributes: [
        'article_column_id',
        'article_column_name',
        'article_column_icon',
        'article_column_icon_type',
        'article_column_tags'
      ],
      where: { article_column_id: column_id } // 为空，获取全部，也可以自己添加条件
    })
    where_params = {
      ...web_where.article
    }
    // where
    // 判断专栏下方是否有专题
    column_id && (where_params['article_tag_ids'] = {
      [Op.regexp]: `^[${find_article_column.article_column_tags.split(',')
        .join('|')}]`
    })

    // order
    //
    order_params.push(['create_date_timestamp', 'desc'])

    let { count, rows } = await models.article
      .findAndCountAll({
        where: where_params, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: order_params
      })

    for (let i in rows) {
      rows[i].setDataValue('create_at', await moment(rows[i].create_date)
        .format('YYYY-MM-DD'))
      rows[i].setDataValue('user', await models.user.findOne({
        where: { uid: rows[i].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      }))
    }

    /* for (let item in rows) {// 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_at = await moment(rows[item].create_date).format('YYYY-MM-DD')
      rows[item].user = await models.user.findOne({
        where: {uid: rows[item].uid},
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
    } */

    if (rows) {
      home_resJson(ctx, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count,
          page,
          pageSize,
          column_id,
          article_list: rows,
          sort
        }
      })
    } else {
      home_resJson(ctx, {
        state: 'error',
        message: '数据返回错误，请再次刷新尝试'
      })
    }
  }

  static async no_found_404(ctx) {
    await render(ctx, {
      title: '404',
      view_url: 'default/404',
      state: 'success',
      message: '404 页面'
    })
  }
}

module.exports = Index
