const de = require('../utils/data_example')

module.exports = async (ctx) => {
  const title = 'article'
  await de.render(ctx, {
    title: title,
    view_url: 'default/article',
    status: 1,
    message: 'article'
  })
}