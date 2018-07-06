const db = require('../models')
const de = require('../utils/res_data')

class Subscribe {

  constructor () {}

  static async get_subscribe (ctx) {
    const title = 'subscribe'

    await de.render(ctx, {
      title: title,
      view_url: 'default/subscribe',
      state: 'success',
      message: 'subscribe',
      data: {}
    })
  }
}

module.exports = Subscribe