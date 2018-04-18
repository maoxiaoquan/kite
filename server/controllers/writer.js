const de = require('../utils/data_example')

class writer {
  constructor () {
  }

  async get_writer (ctx) {
    console.log('6566666666666')
    const title = 'writer'
    await de.render(ctx, {
      title: title,
      view_url: 'default/writer',
      status: 1,
      message: 'writer'
    })
  }

  async post_writer (ctx) {
    let formData = ctx.request.body



  }
}

module.exports = new writer()