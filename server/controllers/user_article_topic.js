const models = require('../models')
const {home_resJson} = require('../utils/res_data')
const moment = require('moment')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class UserArticleTopic {

  constructor () {}

  /**
   * 获取所有文章专题get
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_article_topic_all (ctx) {  /*获取所有文章专题*/
    let article_tag_all = await models.user_article_topic.findAll({
      attributes: ['topic_id', 'topic_name', 'topic_description'],
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

  /**
   * 创建用户专题
   * @param   {obejct} ctx 上下文对象
   */
  static async create_user_article_topic (ctx) {  /*创建用户专题*/
    let formData = ctx.request.body
    try {

      if (formData.topic_name.length === 0) {
        throw  new err_mess('请输入文章专题名字')
      }

      let find_user_article_topic = await models.user_article_topic.findOne({
        where: {
          uid: ctx.session.uid,
          topic_name: formData.topic_name
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
        topic_name: formData.topic_name,
        topic_description: formData.topic_description,
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


  /**
   * 更新用户专题
   * @param   {obejct} ctx 上下文对象
   */
  static async update_user_article_topic (ctx) {
    const res_data = ctx.request.body
    await models.user_article_topic.update({
      topic_name: res_data.topic_name,
      topic_description: res_data.topic_description
    }, {
      where: {
        topic_id: res_data.topic_id,//查询条件
        uid: ctx.session.uid
      }
    })
      .then(function (p) {
        home_resJson(ctx, {
          state: 'success',
          message: '更新成功'
        })
      }).catch(function (err) {
        home_resJson(ctx, {
          state: 'error',
          message: '更新失败'
        })
      })
  }

  /**
   * 删除用户文章专题
   * @param   {obejct} ctx 上下文对象
   */


  static async delete_user_article_topic (ctx) {
    const res_data = ctx.request.body

    await models.user_article_topic.destroy({
      where: {
        topic_id: res_data.topic_id, //查询条件
        uid: ctx.session.uid
      }
    })
      .then(function (p) {
        home_resJson(ctx, {
          state: 'success',
          message: '删除用户文章成功'
        })
      }).catch(function (err) {
        home_resJson(ctx, {
          state: 'error',
          message: '删除用户文章失败'
        })
      })

  }

}

module.exports = UserArticleTopic