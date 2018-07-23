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
        article: sql_article
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
        throw  new err_mess('请输入文章标题')
      }

      if (formData.title.length > 50) {
        throw  new err_mess('文章标题过长，请小于50个字符')
      }

      if (!formData.content) {
        throw  new err_mess('请输入文章内容')
      }

      if (!formData.topic_ids) {
        throw  new err_mess('请选择个人专题')
      }

      if (formData.source.length === 0 || formData.source === null) {
        throw  new err_mess('请选择文章来源类型')
      }

      if (!formData.tag_ids) {
        throw  new err_mess('请选择文章标签')
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
        excerpt: formData.content, /*摘记*/
        content: formData.content, /*主内容*/
        origin_content: formData.content, /*源内容*/
        source: formData.source, // 来源 （1原创 2转载）
        status: 1, // '状态(0:草稿;1:审核中;2:审核通过;3:回收站)'
        type: formData.type, // 类型 （1文章 2说说 3视频 4公告 ）
        create_date: moment().utc().utcOffset(+8).format('YYYY-MM-DD'), /*时间*/
        create_date_timestamp: moment().utc().utcOffset(+8).format('X'), /*时间戳 */
        topic_ids: formData.topic_ids,
        tag_ids: formData.tag_ids
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
      message: '获取所有文章标签成功',
      data: {
        list: article_tag_all
      }
    })
  }

}

module.exports = Article