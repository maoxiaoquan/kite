const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../config')
const { TimeNow, TimeDistance } = require('../../utils/time')
const shortid = require('shortid')
const { lowdb } = require('../../../db/lowdb/index')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction,
  virtualAction,
  virtualType
} = require('../../utils/constant')

const userVirtual = require('../../common/userVirtual')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

/* 动态专题模块模块 */

// 获取动态专题详情

class Collect {
  // 订阅个人专栏
  static async setSubscribeArticleBlog (ctx) {
    const { blog_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneSubscribeArticleBlog = await models.collect_blog.findOne({
        where: {
          uid: user.uid,
          blog_id
        }
      })

      if (oneSubscribeArticleBlog) {
        /* 判断是否关注了 */
        type = oneSubscribeArticleBlog.is_like ? 'cancel' : 'attention'
        await models.collect_blog.update(
          {
            is_like: !oneSubscribeArticleBlog.is_like
          },
          {
            where: {
              uid: user.uid,
              blog_id
            }
          }
        )
      } else {
        type = 'attention'
        await models.collect_blog.create({
          uid: user.uid,
          blog_id,
          is_like: true
        })
      }

      let articleBlogRssCount = await models.collect_blog.count({
        where: {
          blog_id,
          is_like: true
        }
      })

      await models.article_blog.update(
        {
          like_count: articleBlogRssCount
        },
        {
          where: {
            blog_id
          }
        }
      )

      resClientJson(ctx, {
        state: 'success',
        message: type === 'attention' ? '关注个人专栏成功' : '取消个人专栏成功',
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

  // 收藏小书
  static async collectBooks (ctx) {
    const { books_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneCollectBooks = await models.collect_books.findOne({
        where: {
          uid: user.uid,
          books_id
        }
      })

      if (oneCollectBooks) {
        /* 判断是否关注了 */
        type = oneCollectBooks.is_like ? 'cancel' : 'attention'
        await models.collect_books.update(
          {
            is_like: !oneCollectBooks.is_like
          },
          {
            where: {
              uid: user.uid,
              books_id
            }
          }
        )
      } else {
        type = 'attention'
        await models.collect_books.create({
          uid: user.uid,
          books_id,
          is_like: true
        })
      }

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
}

module.exports = Collect
