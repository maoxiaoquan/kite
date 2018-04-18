const de = require('../utils/data_example')

module.exports = async (ctx) => {
  const title = 'home'
  await de.render(ctx, {
    title: title,
    view_url: 'default/index',
    status: 1,
    message: 'home'
  })
}