const { render, client_resJson } = require('../../utils/cli_res_data')
const { lowdb } = require('../../../db/lowdb/index')
class Index {
  static async render_get_index(ctx) {
    let cli_is_success = lowdb.get('cli.is_success').value()
    if (cli_is_success) {
      await render(ctx, {
        title: 'init project',
        view_url: '_cli/index',
        state: 'success',
        message: 'home'
      })
    } else {
      await ctx.redirect('/init')
    }
  }
}

module.exports = Index
