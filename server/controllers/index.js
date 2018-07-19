const models = require('../models')
const {render} = require('../utils/res_data')

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

    console.log('ctx.session', ctx.session)

    let {count, rows} = await models.article.findAndCountAll({
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize//每页限制返回的数据条数
    })

    let article_column = await models.article_column.findAll({
      attributes: ['article_column_id', 'article_column_name', 'article_column_icon', 'article_column_icon_type'],
      where: {enable: 1},//为空，获取全部，也可以自己添加条件
      limit: 10
    })
    console.log('article_tag', article_column)
    await render(ctx, {
      title: title,
      view_url: 'default/index',
      state: 'success',
      message: 'home',
      data: {
        count: count,
        article_list: rows,
        article_column: article_column
      }
    })
  }
}

module.exports = Index
