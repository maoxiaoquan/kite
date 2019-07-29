const models = require('../../../db/mysqldb/index')
const { resClientJson } = require('../../utils/resData')
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
  static async getUserArticleTopicAll (ctx) {
    /* 获取所有文章专题 */
    let { uid } = ctx.query
    try {
      let allUserArticleTopic = await models.article_blog.findAll({
        attributes: ['topic_id', 'topic_name', 'topic_description'],
        where: {
          uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '获取当前用户个人专题成功',
        data: {
          list: allUserArticleTopic
        }
      })
    } catch (err) {
      resClientJson(ctx, {
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
  static async createUserArticleTopic (ctx) {
    /* 创建用户专题 */
    let { topic_name, topic_description, enable } = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (topic_name.length === 0) {
        throw new ErrorMessage('请输入文章专题名字')
      }

      let oneUserArticleTopic = await models.article_blog.findOne({
        where: {
          uid: user.uid,
          topic_name
        }
      })

      if (oneUserArticleTopic) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      await models.article_blog.create({
        topic_name,
        topic_description,
        uid: user.uid,
        enable: enable || false
      })
      resClientJson(ctx, {
        state: 'success',
        message: '文章专题创建成功'
      })
    } catch (err) {
      resClientJson(ctx, {
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
  static async updateUserArticleTopic (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.article_blog.update(
        {
          topic_name: resData.topic_name,
          topic_description: resData.topic_description
        },
        {
          where: {
            topic_id: resData.topic_id, // 查询条件
            uid: user.uid
          }
        }
      )
      resClientJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resClientJson(ctx, {
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

  static async deleteUserArticleTopic (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.article_blog.destroy({
        where: {
          topic_id: resData.topic_id, // 查询条件
          uid: user.uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '删除用户文章成功'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = UserArticleTopic
