const models = require('../../../db/mysqldb/index')
const { resClientJson } = require('../../utils/resData')
const moment = require('moment')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class UserArticleBlog {
  /**
   * 获取所有文章专题get
   * @param   {object} ctx 上下文对象
   */
  static async getUserArticleBlogAll (ctx) {
    /* 获取所有文章专题 */
    let { uid } = ctx.query
    try {
      let allUserArticleBlog = await models.article_blog.findAll({
        attributes: ['blog_id', 'name', 'description'],
        where: {
          uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '获取当前用户个人专题成功',
        data: {
          list: allUserArticleBlog
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
  static async createUserArticleBlog (ctx) {
    /* 创建用户专题 */
    let { blog_name, blog_description, enable } = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (blog_name.length === 0) {
        throw new ErrorMessage('请输入文章专题名字')
      }

      let oneUserArticleBlog = await models.article_blog.findOne({
        where: {
          uid: user.uid,
          name: blog_name
        }
      })

      console.log('oneUserArticleBlog', oneUserArticleBlog)

      if (oneUserArticleBlog) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      console.log('blog_name', blog_name, blog_description, user.uid, enable)

      await models.article_blog.create({
        name: blog_name,
        description: blog_description || '',
        uid: user.uid,
        enable: enable || false
      })
      resClientJson(ctx, {
        state: 'success',
        message: '文章专题创建成功'
      })
    } catch (err) {
      console.log('err', err)
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
  static async updateUserArticleBlog (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.article_blog.update(
        {
          name: resData.name,
          description: resData.description
        },
        {
          where: {
            blog_id: resData.blog_id, // 查询条件
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

  static async deleteUserArticleBlog (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.article_blog.destroy({
        where: {
          blog_id: resData.blog_id, // 查询条件
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

module.exports = UserArticleBlog
