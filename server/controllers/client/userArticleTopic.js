const models = require('../../../db/mysqldb/index')
const { client_resJson } = require('../../utils/res_data')
const moment = require('moment')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class UserArticleTopic {
  /**
   * 获取所有文章专题get
   * @param   {object} ctx 上下文对象
   */
  static async get_user_article_topic_all (ctx) {
    /* 获取所有文章专题 */
    let { uid } = ctx.query
    try {
      let user_topic = await models.user_article_topic.findAll({
        attributes: ['topic_id', 'topic_name', 'topic_description'],
        where: {
          uid
        }
      })
      client_resJson(ctx, {
        state: 'success',
        message: '获取当前用户个人专题成功',
        data: {
          list: user_topic
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 创建用户专题
   * @param   {object} ctx 上下文对象
   */
  static async create_user_article_topic (ctx) {
    /* 创建用户专题 */
    let { topic_name, topic_description, enable } = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (topic_name.length === 0) {
        throw new ErrorMessage('请输入文章专题名字')
      }

      let find_user_article_topic = await models.user_article_topic.findOne({
        where: {
          uid: user.uid,
          topic_name
        }
      })

      if (find_user_article_topic) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      await models.user_article_topic.create({
        topic_name,
        topic_description,
        uid: user.uid,
        enable: enable || false
      })
      client_resJson(ctx, {
        state: 'success',
        message: '文章专题创建成功'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新用户专题
   * @param   {object} ctx 上下文对象
   */
  static async update_user_article_topic (ctx) {
    const res_data = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.user_article_topic.update(
        {
          topic_name: res_data.topic_name,
          topic_description: res_data.topic_description
        },
        {
          where: {
            topic_id: res_data.topic_id, // 查询条件
            uid: user.uid
          }
        }
      )
      client_resJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除用户文章专题
   * @param   {object} ctx 上下文对象
   */

  static async delete_user_article_topic (ctx) {
    const res_data = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.user_article_topic.destroy({
        where: {
          topic_id: res_data.topic_id, // 查询条件
          uid: user.uid
        }
      })
      client_resJson(ctx, {
        state: 'success',
        message: '删除用户文章成功'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = UserArticleTopic
