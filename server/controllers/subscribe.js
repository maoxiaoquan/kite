const {render, home_resJson} = require('../utils/res_data')
const models = require('../models')
const Op = require('sequelize').Op


class Subscribe {

  constructor () {}

  static async render_subscribe_tag (ctx) {
    const title = 'tag'

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let tag_name = ctx.query.tag_name

    let find_where = tag_name ? {enable: 1, article_tag_name: {[Op.like]: `%${tag_name}%`}} : {enable: 1}

    /* let find_user_info = ctx.session.uid ? await models.user_info.findOne({where: {uid: ctx.session.uid}}) : {} */

    let {count, rows} = await models.article_tag.findAndCountAll({
      attributes: ['article_tag_id', 'article_tag_name', 'article_tag_us_name', 'article_tag_icon', 'article_tag_icon_type', 'article_tag_description'],
      where: find_where,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize//每页限制返回的数据条数
    })

    await render(ctx, {
      title: title,
      view_url: 'default/subscribe_tag',
      state: 'success',
      message: 'subscribe',
      data: {
        page,
        count,
        pageSize,
        tag_name,
        article_tag_list: rows
      }
    })
  }

  static async post_subscribe_tag (ctx) {
    const {article_tag_id} = ctx.request.body

    home_resJson(ctx, {
      state: 'success',
      message: '关注文章标签成功'
    })

  }
}

module.exports = Subscribe