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

    let find_user_info = ctx.session.uid ? await models.user_info.findOne({where: {uid: ctx.session.uid}}) : {}

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
        article_tag_list: rows,
        article_tag_ids: find_user_info.article_tag_ids ? find_user_info.article_tag_ids.split(',') : []
      }
    })
  }

  static async post_subscribe_tag (ctx) {
    const {article_tag_id} = ctx.request.body

    let find_user_info = await models.user_info.findOne({where: {uid: ctx.session.uid}})
    let article_tag_ids = find_user_info.article_tag_ids ? find_user_info.article_tag_ids : ''
    let article_tag_ids_arr = article_tag_ids.split(',')
    article_tag_ids_arr.map((item, key) => {
      if (item.length > 0) {
        return item
      }
    })
    article_tag_ids_arr.push(article_tag_id)
    if (article_tag_ids.split(',').indexOf(article_tag_id) === -1) {
      await models.user_info.update({
        article_tag_ids: article_tag_ids_arr.join(',')
      }, {
        where: {uid: ctx.session.uid}//为空，获取全部，也可以自己添加条件
      }).then(() => {
        home_resJson(ctx, {
          state: 'success',
          message: '关注文章标签成功'
        })
      }).catch(() => {
        home_resJson(ctx, {
          state: 'error',
          message: '关注文章标签失败'
        })
      })
    } else {
      home_resJson(ctx, {
        state: 'error',
        message: '关注文章标签失败,当前文章标签已关注'
      })
    }

  }
}

module.exports = Subscribe