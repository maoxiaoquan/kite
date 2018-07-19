const models = require('../models')
const de = require('../utils/res_data')

class User {

  constructor () { }

  /**
   * 用户的个人中心
   * @param   {obejct} ctx 上下文对象
   */

  static async verify_user (ctx, next) {

    let uid = ctx.params.uid
    let find_user = await models.user.findOne({where: {uid}})
    if (find_user) {
      await next()
    } else {
      ctx.body = '用户不存在'
    }
  }

  static async render_user_center (ctx) {

    const title = 'user'
    let uid = ctx.params.uid

    let find_user_article = await models.article.findAll({where: {uid}})

    await de.render(ctx, {
      title: title,
      view_url: 'default/user',
      state: 'success',
      message: 'user',
      data: {
        uid,
        article_list: find_user_article,
        router_name: '/'
      }
    })
  }

  static async render_user_center_topic (ctx) {

    const title = 'user'
    let uid = ctx.params.uid
    console.log('uid', ctx.query)
    await de.render(ctx, {
      title: title,
      view_url: 'default/user',
      state: 'success',
      message: 'user',
      data: {
        uid,
        router_name: 'topic'
      }
    })
  }
}

module.exports = User