const models = require('../models')
const de = require('../utils/res_data')

class Personal_center {

  constructor () { }

  /**
   * 用户的个人中心
   * @param   {obejct} ctx 上下文对象
   */

  static async verify_user (ctx, next) {

    let uid = ctx.params.uid
    let find_user = await models.user.findOne({
      where: {uid},
      attributes: ['uid', 'avatar', 'nickname']
    })
    ctx.request.current_user = find_user
    if (find_user) {
      await next()
    } else {
      ctx.body = '用户不存在'
    }
  }

  static async render_user_center_article (ctx) {

    const title = 'home'
    let uid = ctx.params.uid
    let topic_id = ctx.params.topic_id || 'all'

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 15

    let where_params = topic_id === 'all' ? {uid} : {uid, article_topic_ids: topic_id}
    let {count, rows} = await models.article.findAndCountAll({
      where: where_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    })

    let user_article_topic_all = await models.user_article_topic.findAll({
      where: {uid},//为空，获取全部，也可以自己添加条件
      attributes: ['user_article_topic_id', 'user_article_topic_name']
    })

    /*所有文章专题*/
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    await de.render(ctx, {
      title: title,
      view_url: 'default/user_center_article',
      state: 'success',
      message: 'home',
      data: {
        uid,
        current_user: ctx.request.current_user,
        count: count,
        user_article_topic_all,
        topic_id,
        page,
        pageSize,
        article_list: rows,
        tag_all: article_tag_all,
        router_name: ''
      }
    })
  }

  static async render_user_center_topic (ctx) {

    const title = 'user'
    let uid = ctx.params.uid
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let {count, rows} = await models.user_article_topic.findAndCountAll({
      where: {uid},//为空，获取全部，也可以自己添加条件
      attributes: ['user_article_topic_id', 'user_article_topic_name'],
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    })

    await de.render(ctx, {
      title: title,
      view_url: 'default/user_center_topic',
      state: 'success',
      message: 'user',
      data: {
        uid,
        current_user: ctx.request.current_user,
        page,
        count,
        pageSize,
        user_article_topic_all:rows,
        router_name: 'topic'
      }
    })
  }
}

module.exports = Personal_center