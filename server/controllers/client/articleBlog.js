const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../config')
const { TimeNow, TimeDistance } = require('../../utils/time')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

/* 动态专题模块模块 */

// 获取动态专题详情

class dynamicBlog {
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
    let {
      blog_name,
      en_name,
      blog_description,
      icon,
      is_public,
      enable
    } = ctx.request.body
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

      let enNameArticleBlog = await models.article_blog.findOne({
        where: {
          en_name: en_name
        }
      })

      if (oneUserArticleBlog) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      if (!en_name) {
        throw new ErrorMessage('请输入英文名字')
      }

      if (en_name.length > 60) {
        throw new ErrorMessage('英文名字小于60个字符')
      }

      if (enNameArticleBlog) {
        throw new ErrorMessage('英文名字已存在')
      }

      await models.article_blog.create({
        name: blog_name,
        en_name: en_name || blog_name,
        icon: icon || config.DF_ICON,
        description: blog_description || '',
        uid: user.uid,
        enable: enable || false,
        is_public: is_public || false,
        status: 1
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

  static async getArticleBlogList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 24
    let sort = ctx.query.sort
    let whereParams = {
      is_public: true,
      status: {
        [Op.or]: [2, 4]
      }
    }
    let orderParams = []

    !sort && (orderParams = [['create_date', 'DESC']])
    sort === 'hot' && (orderParams = [['like_count', 'DESC']])

    try {
      let { count, rows } = await models.article_blog.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'like_count',
          await models.rss_article_blog.count({
            where: { blog_id: rows[i].blog_id }
          })
        )
        rows[i].setDataValue(
          'create_at',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      await resClientJson(ctx, {
        state: 'success',
        message: 'success',
        data: {
          page,
          count,
          pageSize,
          list: rows
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
}

module.exports = dynamicBlog
