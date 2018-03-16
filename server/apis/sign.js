const data_format = require('../utils/data_format')

module.exports = {
  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  async sign_in(ctx) {
    ctx.body = {
      data: 'sign_in'
    }
  },

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  async sign_up(ctx) {
    data_format(ctx,
      {
        title: '66666'
      })
  }
}