const models = require('../models')
const moment = require('moment')
const {render, home_resJson} = require('../utils/res_data')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Article {

  constructor () {}

  static async render_article (ctx) {
    const title = 'article'

    let aid = ctx.params.aid

    let sql_article = await models.article.findOne({
      where: {
        aid: aid
      }
    })

    await render(ctx, {
      title: title,
      view_url: 'default/article',
      state: 'success',
      message: 'article',
      data: {
        article: sql_article.dataValues
      }
    })
  }

  static async render_writer (ctx) {
    const title = 'writer'
    await render(ctx, {
      title: title,
      view_url: 'default/writer',
      state: 'success',
      message: 'writer'
    })
  }

  static async post_create_writer (ctx) {
    let formData = ctx.request.body
    console.log('formData', formData)
    try {

      if (!formData.title) {
        console.log('req_data', formData)
        throw  new err_mess('请输入文章标题')
      }
      if (!formData.content) {
        throw  new err_mess('请输入文章内容')
      }

      if (!formData.type) {
        throw  new err_mess('请选择文章类型')
      }

    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    try {
      await models.article.create({
        uid: ctx.session.uid,
        author: ctx.session.nickname,
        title: formData.title,
        content: formData.content,
        origin_content: formData.content,
        source: formData.source, // 来源 （1原创 2转载）
        excerpt: formData.content,
        status: 1, // '状态(0:草稿;1:审核中;2:审核通过;3:回收站)'
        type: 1, // 类型 （1文章 2说说 3视频 4公告 ）
        create_date: moment().utc().utcOffset(+8).format('X'),
        topic_ids: '',
        tag_ids: ''
      }).then(function (data) {
        home_resJson(ctx, {
          state: 'success',
          message: '文章创建成功'
        })

      }).catch(function (err) {
        home_resJson(ctx, {
          state: 'error',
          message: err
        })
      })

    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
    }

  }

  /**
   * 文章的标签
   * @param   {obejct} ctx 上下文对象
   */

  static async render_get_tag (ctx) {

    const title = 'tag'

    await render(ctx, {
      title: title,
      view_url: 'default/tag',
      state: 'success',
      message: 'user',
      data: ''
    })
  }

  static async get_article_tag_all (ctx) {
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name'],
      where: {enable: true}//为空，获取全部，也可以自己添加条件
    })
    home_resJson(ctx, {
      state: 'success',
      message: '获取当前用户个人专题成功',
      data: {
        list: article_tag_all
      }
    })
  }

}

module.exports = Article