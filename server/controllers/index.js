const models = require('../models')
const {render} = require('../utils/res_data')

class index {
  constructor (state) {
    this.state = {
      title: '333'
    }
  }

  async get_index (ctx) {

    let page = 1
    let pageSize = 10
    const title = 'home'

    console.log('ctx.session', ctx.session)

    let {count, rows} = await models.article.findAndCountAll({
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize//每页限制返回的数据条数
    })

    let article_tag = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name', 'article_tag_us_name', 'article_tag_icon', 'article_tag_icon_type'],
      where: {enable: 1},//为空，获取全部，也可以自己添加条件
      limit: 10
    })
    console.log('article_tag', article_tag)
    await render(ctx, {
      title: title,
      view_url: 'default/index',
      state: 'success',
      message: 'home',
      data: {
        count: count,
        article_list: rows,
        article_tag: article_tag
      }
    })
  }
}

module.exports = new index()
