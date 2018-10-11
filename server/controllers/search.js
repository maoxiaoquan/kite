const models = require('../models')
const moment = require('moment')
const {render} = require('../utils/res_data')
const Op = require('sequelize').Op

class Search {

  constructor () { }

  /**
   * 文章的标签
   * @param   {obejct} ctx 上下文对象
   */

  static async form_search (ctx) {

    const title = 'search'
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let search = ctx.query.search

    let {count, rows} = await models.article.findAndCountAll({
      where: {title: {[Op.like]: `%${search}%`}},//为空，获取全部，也可以自己添加条件
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

    /*所有文章专题*/
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    await render(ctx, {
      title: title,
      view_url: 'default/search',
      state: 'success',
      message: 'search',
      data: {
        page,
        count,
        pageSize,
        search,
        tag_all: article_tag_all,
        article_list: rows
      }
    })
  }

}

module.exports = Search