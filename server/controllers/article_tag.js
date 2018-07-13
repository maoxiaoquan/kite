const models = require('../models')
const de = require('../utils/res_data')

class Article_Tag {

  constructor () { }

  /**
   * 文章的标签
   * @param   {obejct} ctx 上下文对象
   */

  static async get_tag (ctx) {

    const title = 'tag'


    await de.render(ctx, {
      title: title,
      view_url: 'default/tag',
      state: 'success',
      message: 'user',
      data: ''
    })
  }

}

module.exports = Article_Tag