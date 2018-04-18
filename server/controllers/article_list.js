const de = require('../utils/data_example')

module.exports = async (ctx) => {
  const title = 'article_list'
  await de.render(ctx, {
    title: title,
    view_url: 'default/article_list',
    status: 1,
    message: 'article'
  })
}