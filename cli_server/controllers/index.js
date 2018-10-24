const { render, home_resJson } = require('../utils/res_data')

class Index {
  static async render_get_index(ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: 'default/index',
      state: 'success',
      message: 'home'
    })
  }
}

module.exports = Index
