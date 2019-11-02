const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType
} = require('../../utils/constant')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class Like {
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
}

module.exports = Like
