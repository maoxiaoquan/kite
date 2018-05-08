const de = require('../utils/data_example')
const db = require('../db/db')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class writer {
  constructor () {
  }

  async get_writer (ctx) {
    console.log('6566666666666')
    const title = 'writer'
    await de.render(ctx, {
      title: title,
      view_url: 'default/writer',
      state: 'success',
      message: 'writer'
    })
  }

  async post_writer (ctx) {
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
      ctx.body = {
        state:'error',
        message: err.message
      }
      return false
    }

    try {
      await db.article.create({
        user_id: ctx.session.user_id,
        author: ctx.session.nickname,
        create_date:moment().utc().utcOffset(+8).format('X'),
        content: formData.content,
        title: formData.title,
        excerpt: formData.content,
        status: 1,
        type: formData.type,
        category: formData.category
      }).then(function (data) {
        ctx.body = {
          state: 'success',
          message: '文章创建成功'
        }

      }).catch(function (err) {
        ctx.body = {
          state: 'error',
          message: err
        }
      })

    } catch (err) {
      ctx.body = {
        state: 'error',
        message: err.message
      }
    }

  }
}

module.exports = new writer()