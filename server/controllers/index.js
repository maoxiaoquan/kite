const models = require('../models')
const {render} = require('../utils/res_data')
const Op = require('sequelize').Op

class Index {
  constructor (state) {
    this.state = {
      title: '333'
    }
  }

  static async render_get_index (ctx) {

    let page = 1
    let pageSize = 10
    const title = 'home'

    let column_id = ctx.params.column_id || 'all'

    let find_article_column = await models.article_column.findOne({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type', 'article_column_tags'],
      where: {article_column_id: ctx.params.column_id}//为空，获取全部，也可以自己添加条件
    })

    let current_article_tags = find_article_column ? find_article_column.article_column_tags.split(',') : ''

    let find_params = {}

    if (!find_article_column) {
      find_params = ''
    } else {
      find_params = {article_tag_ids: {[Op.regexp]: `^[${current_article_tags.join('|')}]`}}
    }

    let {count, rows} = await models.article.findAndCountAll({
      where: find_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
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
}

module.exports = Index
