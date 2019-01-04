const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const {render, home_resJson} = require('../../utils/res_data')
const Op = require('sequelize').Op
const web_where = require('../../utils/web_where')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Banner {
  constructor () {}

  /**
   * 获取所有文章标签get
   * @param   {obejct} ctx 上下文对象
   */
  static async get_home_banner (ctx) {

    let home_banner = await models.banner.findAll({
      attributes: ['id', 'article_url', 'title', 'img_url'],
      limit: 2,
      where: {enable: true, type: '1'}, //为空，获取全部，也可以自己添加条件 只取type 等于1 的
      order: [['create_date_timestamp', 'desc']]
    })

    let home_article_banner = await models.article.findAll({
      attributes: ['aid', 'title', 'cover_img'],
      limit: 2 - home_banner.length,
      where: {...web_where.article}, //为空，获取全部，也可以自己添加条件 只取type 等于1 的
      order: [['read_count', 'desc']]
    })

    let banner = await [].concat(home_banner, home_article_banner)

    home_resJson(ctx, {
      state: 'success',
      message: '获取首页banner成功',
      data: {
        banner
      }
    })

  }

}

module.exports = Banner
