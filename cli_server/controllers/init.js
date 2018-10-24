const { render, home_resJson } = require('../utils/res_data')
const { lowdb } = require('../../db/lowdb')

class Init {
  static async render_init(ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: 'default/init',
      state: 'success',
      message: 'home'
    })
  }

  static async post_set_step(ctx) {
    await home_resJson(ctx, {
      title: 'init project',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_one(ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: 'default/init_step_one',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_two(ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: 'default/init_step_two',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_three(ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: 'default/init_step_three',
      state: 'success',
      message: 'home'
    })
  }
}

module.exports = Init
