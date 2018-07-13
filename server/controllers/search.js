const models = require('../models')
const de = require('../utils/res_data')

class Search {

  constructor () { }

  /**
   * 文章的标签
   * @param   {obejct} ctx 上下文对象
   */

  static async get_search (ctx) {

    const title = 'search'


    await de.render(ctx, {
      title: title,
      view_url: 'default/search',
      state: 'success',
      message: 'user',
      data: ''
    })
  }

}

module.exports = Search