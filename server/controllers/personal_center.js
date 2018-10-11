const models = require('../models')
const moment = require('moment')
const {render, home_resJson} = require('../utils/res_data')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Personal_center {

  constructor () { }

  /**
   * 用户的个人中心验证
   * @param   {obejct} ctx 上下文对象
   */
  static async verify_user (ctx, next) {

    let uid = ctx.params.uid

    let find_user = await models.user.findOne({
      where: {uid},
      attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
    })

    let user_attention_count = await models.user_attention.count({ // 是否关注
      where: {
        uid: ctx.session.uid,
        attention_uid: uid
      }
    })

    let user_attention_other_count = await models.user_attention.count({ // 关注了多少人
      where: {
        uid
      }
    })

    let other_user_attention_count = await models.user_attention.count({ // 多少人关注了
      where: {
        attention_uid: uid
      }
    })

    let user_article_count = await models.article.count({ // 他有多少文章
      where: {
        uid
      }
    })

    find_user.user_attention_count = user_attention_count
    find_user.other_user_attention_count = other_user_attention_count
    find_user.user_attention_other_count = user_attention_other_count
    find_user.user_article_count = user_article_count

    ctx.request.current_user = find_user

    if (find_user) {
      await next()
    } else {
      ctx.body = '用户不存在'
    }
  }

  /**
   * 用户个人中心个人文章列表render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_user_center_article (ctx) {

    const title = 'home'
    let uid = ctx.params.uid
    let topic_id = ctx.params.topic_id || 'all'

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    let where_params = topic_id === 'all' ? {uid} : {uid, article_topic_ids: topic_id}
    let {count, rows} = await models.article.findAndCountAll({
      where: where_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    }).then((res) => {
      res.rows.map((item, key) => {
        item.create_at = moment(item.create_date).format('YYYY-MM-DD')
        return item
      })
      return res
    })

    for (let item in rows) { // 循环取用户
      await (async (i) => {
        rows[i].user = {}
        let data = await models.user.findOne({
          where: {uid: rows[i].uid},
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        }).then((res) => {
          return JSON.parse(JSON.stringify(res))
        })
        if (data) {
          rows[i].user = data
        }
      })(item)
    }

    let user_article_topic_all = await models.user_article_topic.findAll({
      where: {uid},//为空，获取全部，也可以自己添加条件
      attributes: ['topic_id', 'topic_name']
    })

    /*所有文章专题*/
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    await render(ctx, {
      title: title,
      view_url: 'default/user_center/user_center_article',
      state: 'success',
      message: 'home',
      data: {
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

  /**
   * 用户个人中心用户关注用户render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_user_center_attention (ctx) {

    let uid = ctx.params.uid

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    let any = ctx.query.any || 'me'

    let user_attention_uid_arr

    let me_attention = await models.user_attention.findAll({where: {uid}}).then((res) => {
      return res.map((attention_item, tag_key) => {
        return attention_item.attention_uid
      })
    })
    let other_attention = await models.user_attention.findAll({where: {attention_uid: uid}}).then((res) => {
      return res.map((attention_item, tag_key) => {
        return attention_item.uid
      })
    })

    if (any === 'me') {
      user_attention_uid_arr = me_attention
    } else {
      user_attention_uid_arr = other_attention
    }

    let {count, rows} = await models.user.findAndCountAll({
      where: {uid: {in: user_attention_uid_arr}},//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    })

    await render(ctx, {
      title: 'attention',
      view_url: 'default/user_center/user_center_attention',
      state: 'success',
      message: 'home',
      data: {
        current_user: ctx.request.current_user,
        count,
        page,
        pageSize,
        user_list: rows,
        router_name: 'attention',
        me_attention,
        other_attention,
        any
      }
    })
  }

  /**
   * 用户关注用户post
   * @param   {obejct} ctx 上下文对象
   */
  static async post_user_attention (ctx) {
    const {attention_uid} = ctx.request.body

    try {
      if (attention_uid == ctx.session.uid) {
        throw new err_mess('关注用户失败，自己不能关注自己')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    let findone_user_attention = await models.user_attention.findOne({
      where: {
        uid: ctx.session.uid,
        attention_uid
      }
    })

    if (findone_user_attention) { /*判断是否关注了，是则取消，否则添加*/

      await models.user_attention.destroy({
        where: {
          uid: ctx.session.uid,
          attention_uid
        }
      }).then(() => {
        home_resJson(ctx, {
          state: 'success',
          message: '取消关注用户成功'
        })
      }).catch(() => {
        home_resJson(ctx, {
          state: 'error',
          message: '取消关注用户失败'
        })
      })

    } else {
      await models.user_attention.create(
        {
          uid: ctx.session.uid,
          attention_uid
        }
      ).then(async () => {

        await models.user_message.create({ // 用户行为记录
          uid: attention_uid,
          type: 3,  // 类型 1 喜欢文章  2 关注标签 3 关注用户 4 评论回复 5 文章有新的评论
          other_uid: ctx.session.uid,
          title: '有新的关注',
          content: ''
        })

        home_resJson(ctx, {
          state: 'success',
          message: '关注用户成功'
        })
      }).catch(() => {
        home_resJson(ctx, {
          state: 'error',
          message: '关注用户失败'
        })
      })
    }
  }

  /**
   * 用户like文章render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_user_center_like (ctx) {

    let uid = ctx.params.uid

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    let user_like_article_arr = await models.user_like_article.findAll({where: {uid}}).then((res) => {
      return res.map((user_like_article_item, key) => {
        return user_like_article_item.aid
      })
    })

    let where_params = {aid: {in: user_like_article_arr}}

    let {count, rows} = await models.article.findAndCountAll({
      where: where_params,//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    }).then((res) => {
      res.rows.map((item, key) => {
        item.create_at = moment(item.create_date).format('YYYY-MM-DD')
        return item
      })
      return res
    })

    for (let item in rows) { // 循环取用户
      await (async (i) => {
        rows[i].user = {}
        let data = await models.user.findOne({
          where: {uid: rows[i].uid},
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        }).then((res) => {
          return JSON.parse(JSON.stringify(res))
        })
        if (data) {
          rows[i].user = data
        }
      })(item)
    }

    /*所有文章专题*/
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    await render(ctx, {
      title: '我喜欢的文章',
      view_url: 'default/user_center/user_center_like',
      state: 'success',
      message: 'home',
      data: {
        current_user: ctx.request.current_user,
        count: count,
        page,
        pageSize,
        article_list: rows,
        tag_all: article_tag_all,
        router_name: 'like'
      }
    })
  }

  /**
   * 用户like文章post
   * @param   {obejct} ctx 上下文对象
   */
  static async post_user_like_article (ctx) {

    const {aid} = ctx.request.body

    let findone_user_attention = await models.user_like_article.findOne({
      where: {
        uid: ctx.session.uid,
        aid
      }
    })

    if (findone_user_attention) { /*判断是否like文章，是则取消，否则添加*/

      await models.sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return models.user_like_article.destroy({
          where: {
            uid: ctx.session.uid,
            aid
          }
        }, {...transaction}) /* 删除user article关联 */
          .then(function (user_like_article_destroy) {
            return models.user_like_article.count({
              where: {
                aid
              }
            }, {...transaction})
            /* 获取文章所有like数 */
          }).then(function (user_like_article_count) {
            return models.article.update({
              like_count: user_like_article_count
            }, {'where': {aid}}, {...transaction})
            /* 修改文章like数 */
          })

      }).then(() => {
        home_resJson(ctx, {
          state: 'success',
          message: '取消like文章成功'
        })
      }).catch(() => {
        home_resJson(ctx, {
          state: 'error',
          message: '取消like文章失败'
        })
      })

    } else {

      await models.sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return models.user_like_article.create({
          uid: ctx.session.uid,
          aid
        }, {...transaction}) /* 添加user article关联 */
          .then(function (user_like_article_destroy) {
            return models.user_like_article.count({
              where: {
                aid
              }
            }, {...transaction})
            /* 获取文章所有like数 */
          }).then(function (user_like_article_count) {
            return models.article.update({
              like_count: user_like_article_count
            }, {'where': {aid}}, {...transaction})
            /* 修改文章like数 */
          })

      }).then(async () => {

        home_resJson(ctx, {
          state: 'success',
          message: 'like文章成功'
        })
      }).catch(() => {
        home_resJson(ctx, {
          state: 'error',
          message: 'like文章失败'
        })
      })
    }
  }

  /**
   * 用户like文章render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_user_center_message (ctx) {

    await render(ctx, {
      title: '消息',
      view_url: 'default/user_center/user_center_message',
      state: 'success',
      data: {
        current_user: ctx.request.current_user,
        router_name: 'message'
      }
    })
  }
}

module.exports = Personal_center