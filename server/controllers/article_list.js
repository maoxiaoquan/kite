const de = require('../utils/res_data')

module.exports = async (ctx) => {
  const title = 'article_list'
  await de.render(ctx, {
    title: title,
    view_url: 'default/article_list',
    state: 'success',
    message: 'article'
  })
}