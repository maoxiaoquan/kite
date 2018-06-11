const db = require('../models')
const de = require('../utils/res_data')

class article {

  constructor () {}

  async get_article (ctx) {
    const title = 'article'

    let aid = ctx.params.aid

    let sql_article = await db.article.findOne({
      where: {
        aid: aid
      }
    })

    console.log('sql_article', sql_article)

    await de.render(ctx, {
      title: title,
      view_url: 'default/article',
      state: 'success',
      message: 'article',
      data: {
        article: sql_article.dataValues
      }
    })
  }
}

module.exports = new article()