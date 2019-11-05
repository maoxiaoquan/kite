const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction,
  userMessageActionText,
  virtualAction,
  virtualType
} = require('../../utils/constant')

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')

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
      let oneArticle = await models.article.findOne({
        where: {
          aid
        }
      })

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

        await userMessage.setMessage({
          uid: oneArticle.uid,
          sender_id: user.uid,
          action: userMessageAction.like, // 动作：关注
          type: userMessageType.like_article, // 类型：用户
          content: JSON.stringify({
            aid
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
