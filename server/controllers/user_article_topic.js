const models = require('../models')
const {home_resJson} = require('../utils/res_data')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class UserArticleTopic {

  constructor () {}

  static async get_user_article_topic_all (ctx) {  /*获取所有文章专题*/
    let article_tag_all = await models.user_article_topic.findAll({
      attributes: ['user_article_topic_id', 'user_article_topic_name'],
      where: {
        uid: ctx.session.uid
      }
    })
    home_resJson(ctx, {
      state: 'success',
      message: '获取当前用户个人专题成功',
      data: {
        list: article_tag_all
      }
    })
  }

  static async create_user_article_topic (ctx) {  /*创建用户专题*/
    let formData = ctx.request.body
    try {

      if (formData.user_article_topic_name.length === 0) {
        throw  new err_mess('请输入文章专题名字')
      }

      let find_user_article_topic = await models.user_article_topic.findOne({
        where: {
          uid: ctx.session.uid,
          user_article_topic_name: formData.user_article_topic_name
        }
      })

      if (find_user_article_topic) {
        throw  new err_mess('不能创建自己已有的专题')
      }

    } catch (err) {
      console.log('formData', err.message)
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    try {
      await models.user_article_topic.create({
        user_article_topic_name: formData.user_article_topic_name,
        user_article_topic_description: formData.user_article_topic_description,
        create_date: moment().utc().utcOffset(+8).format('X'),
        uid: ctx.session.uid,
        enable: formData.enable || false
      }).then(function (data) {
        home_resJson(ctx, {
          state: 'success',
          message: '文章专题创建成功'
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

}

module.exports = UserArticleTopic