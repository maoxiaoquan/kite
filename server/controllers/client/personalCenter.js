const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class PersonalCenter {
  /**
   * 用户个人中心个人文章列表render
   * @param   {object} ctx 上下文对象
   */
  static async userMyArticle (ctx) {
    let uid = ctx.query.uid
    let blog_id = ctx.query.blog_id || 'all'
    let type = ctx.query.type || '1'
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let whereParams = {
      uid,
      type,
      ...clientWhere.article.me
    }
    try {
      blog_id !== 'all' && (whereParams.blog_ids = blog_id)

      let { count, rows } = await models.article.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        let oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: rows[i].blog_ids }
        })

        if (oneArticleBlog && ~[2, 4].indexOf(oneArticleBlog.status)) {
          rows[i].setDataValue('article_blog', oneArticleBlog)
        }

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
              }
            })
          )
        }

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
        message: 'home',
        data: {
          count: count,
          blog_id,
          page,
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

  /**
   * 用户个人中心用户关注用户render
   * @param   {object} ctx 上下文对象
   */
  static async getUserAttentionList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let any = ctx.query.any || 'me'
    let whereParmas = {}
    try {
      if (any === 'me') {
        whereParmas = {
          uid: uid,
          is_attention: true
        }
      } else {
        whereParmas = {
          attention_uid: uid,
          is_attention: true
        }
      }

      let { count, rows } = await models.attention_user.findAndCountAll({
        where: whereParmas, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: any === 'me' ? rows[i].attention_uid : rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'userAttentionIds',
          await models.attention_user.findAll({
            where: {
              attention_uid: any === 'me' ? rows[i].attention_uid : rows[i].uid,
              is_attention: true
            }
          })
        )
      }

      await resClientJson(ctx, {
        state: 'success',
        message: '获取列表成功',
        data: {
          count,
          page,
          pageSize,
          list: rows,
          any
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
   * 用户关注用户post
   * @param   {object} ctx 上下文对象
   */
  static async setUserAttention (ctx) {
    const { attention_uid } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      if (attention_uid === user.uid) {
        throw new ErrorMessage('关注用户失败，自己不能关注自己')
      }

      let oneUserAttention = await models.attention_user.findOne({
        where: {
          uid: user.uid,
          attention_uid
        }
      })

      if (oneUserAttention) {
        /* 判断是否关注了 */
        type = oneUserAttention.is_attention ? 'cancel' : 'attention'
        await models.attention_user.update(
          {
            is_attention: !oneUserAttention.is_attention
          },
          {
            where: {
              uid: user.uid,
              attention_uid
            }
          }
        )
      } else {
        type = 'attention' // 只在第一次关注的时候提交推送
        await models.user_message.create({
          // 用户行为记录
          uid: attention_uid,
          type: 4, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
          content: JSON.stringify({
            other_uid: user.uid,
            attention_uid,
            title: '有新的关注'
          })
        })
        await models.attention_user.create({
          uid: user.uid,
          attention_uid,
          is_attention: true
        })
      }

      resClientJson(ctx, {
        state: 'success',
        message: type === 'attention' ? '关注成功' : '取消关注成功',
        data: {
          type
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
   * 用户like文章render
   * @param   {object} ctx 上下文对象
   */
  static async getUserLikeArticleList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    try {
      let allUserLikeArticle = await models.like_article
        .findAll({ where: { uid, is_like: true } })
        .then(res => {
          return res.map((item, key) => {
            return item.aid
          })
        })

      let where_params = { aid: { [Op.in]: allUserLikeArticle } }

      let { count, rows } = await models.article.findAndCountAll({
        where: where_params, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
              }
            })
          )
        }

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
        message: 'home',
        data: {
          count: count,
          page,
          pageSize,
          article_list: rows
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
   * 用户like文章post
   * @param   {object} ctx 上下文对象
   */
  static async setUserLikeArticle (ctx) {
    const { aid, uid } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneUserLikeArticle = await models.like_article.findOne({
        where: {
          uid: user.uid,
          aid
        }
      })

      if (oneUserLikeArticle) {
        /* 判断是否关注了 */
        type = oneUserLikeArticle.is_like ? 'cancel' : 'attention'
        await models.like_article.update(
          {
            is_like: !oneUserLikeArticle.is_like
          },
          {
            where: {
              uid: user.uid,
              aid
            }
          }
        )
      } else {
        type = 'attention' // 只在第一次关注的时候提交推送
        await models.user_message.create({
          // 用户行为记录
          uid: uid,
          type: 2, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
          content: JSON.stringify({
            other_uid: user.uid,
            aid,
            title: '文章有新的喜欢'
          })
        })
        await models.like_article.create({
          uid: user.uid,
          aid,
          is_like: true
        })
      }

      let articleLikeCount = await models.like_article.count({
        where: {
          aid,
          is_like: true
        }
      })

      await models.article.update(
        {
          like_count: articleLikeCount
        },
        { where: { aid } }
      )

      resClientJson(ctx, {
        state: 'success',
        message: type === 'attention' ? '收藏成功' : '取消收藏成功',
        data: {
          type
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
   * 用户like动态post
   * @param   {object} ctx 上下文对象
   */
  static async setUserLikeDynamic (ctx) {
    const { dynamic_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneUserLikeArticle = await models.dynamic_like.findOne({
        where: {
          uid: user.uid,
          dynamic_id
        }
      })

      if (oneUserLikeArticle) {
        /* 判断是否like动态，是则取消，否则添加 */
        type = 'cancel'
        await models.dynamic_like.destroy({
          where: {
            uid: user.uid,
            dynamic_id
          }
        })
      } else {
        type = 'like'
        await models.dynamic_like.create({
          uid: user.uid,
          dynamic_id
        })
        // 暂时取消
        // await models.user_message.create({
        //   // 用户行为记录
        //   uid: uid,
        //   type: 6, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
        //   content: JSON.stringify({
        //     other_uid: user.uid,
        //     aid: aid,
        //     title: '文章有新的喜欢'
        //   })
        // })
      }

      let dynamicLikeCount = await models.dynamic_like.count({
        where: {
          dynamic_id
        }
      })

      await models.dynamic.update(
        {
          like_count: dynamicLikeCount
        },
        { where: { id: dynamic_id } }
      )

      resClientJson(ctx, {
        state: 'success',
        data: {
          type
        },
        message: type === 'like' ? 'like动态成功' : '取消like动态成功'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async getDynamicListMe (ctx) {
    const { uid } = ctx.query
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let whereParams = {} // 查询参数
    let orderParams = [['create_date', 'DESC']] // 排序参数

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        uid,
        status: {
          [Op.or]: [1, 2, 3, 4]
        }
      }

      let { count, rows } = await models.dynamic.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        rows[i].setDataValue(
          'topic',
          rows[i].topic_ids
            ? await models.dynamic_topic.findOne({
              where: { topic_id: rows[i].topic_ids }
            })
            : ''
        )

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'userAttentionIds',
          await models.attention_user.findAll({
            where: {
              attention_uid: rows[i].uid,
              is_attention: true
            }
          })
        )
      }

      if (rows) {
        resClientJson(ctx, {
          state: 'success',
          message: '数据返回成功',
          data: {
            count,
            page,
            pageSize,
            list: rows
          }
        })
      } else {
        resClientJson(ctx, {
          state: 'error',
          message: '数据返回错误，请再次刷新尝试'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户个人中心个人专栏列表
   * @param   {object} ctx 上下文对象
   */
  static async userArticleBlogList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let whereParams = {
      uid
    }
    try {
      let { count, rows } = await models.article_blog.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['update_date', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue('update_dt', await TimeDistance(rows[i].update_dt))

        rows[i].setDataValue(
          'articleCount',
          await models.article.count({
            where: { blog_ids: rows[i].blog_id }
          })
        )

        rows[i].setDataValue(
          'likeCount',
          await models.collect_blog.count({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
            })
          )
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'likeUserIds',
          await models.collect_blog.findAll({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )
      }

      await resClientJson(ctx, {
        state: 'success',
        message: '获取用户个人专栏成功列表',
        data: {
          count: count,
          page,
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

  /**
   * 用户个人中心个人小书列表
   * @param   {object} ctx 上下文对象
   */
  static async userBooksList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let whereParams = {
      uid
    }
    try {
      let { count, rows } = await models.books.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['update_date', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue('update_dt', await TimeDistance(rows[i].update_dt))

        rows[i].setDataValue(
          'bookCount',
          await models.book.count({
            where: { books_id: rows[i].books_id }
          })
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
            })
          )
        }

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
        message: '获取用户个人小书列表',
        data: {
          count,
          page,
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

module.exports = PersonalCenter
