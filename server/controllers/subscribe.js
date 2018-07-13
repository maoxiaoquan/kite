const {render} = require('../utils/res_data')
const models = require('../models')

class Subscribe {

  constructor () {}

  static async get_subscribe_tag (ctx) {
    const title = 'tag'

    let page = 1
    let pageSize = 10

    console.log('ctx.session', ctx.session)

    let {count, rows} = await models.article_tag.findAndCountAll({
      attributes: ['article_tag_id', 'article_tag_name', 'article_tag_us_name', 'article_tag_icon', 'article_tag_icon_type', 'article_tag_description'],
      where: {enable: 1},//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize//每页限制返回的数据条数
    })

    await render(ctx, {
      title: title,
      view_url: 'default/subscribe_tag',
      state: 'success',
      message: 'subscribe',
      data: {
        count,
        rows
      }
    })
  }

}

module.exports = Subscribe