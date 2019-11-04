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

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class Thumb {
  /**
   * 用户like动态post
   * @param   {object} ctx 上下文对象
   */
  static async setUserThumbDynamic (ctx) {
    const { dynamic_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneDynamic = await models.dynamic.findOne({
        where: {
          id: dynamic_id
        }
      })
      let oneUserThumbDynamic = await models.thumb_dynamic.findOne({
        where: {
          uid: user.uid,
          dynamic_id
        }
      })

      if (oneUserThumbDynamic) {
        /* 判断是否like动态，是则取消，否则添加 */
        type = 'cancel'
        await models.thumb_dynamic.destroy({
          where: {
            uid: user.uid,
            dynamic_id
          }
        })
      } else {
        type = 'like'
        await userMessage.setMessage({
          uid: oneDynamic.uid,
          sender_id: user.uid,
          action: userMessageAction.thumb, // 动作：点赞
          type: userMessageType.thumb_dynamic, // 类型：点赞动态
          content: JSON.stringify({
            dynamic_id: dynamic_id
          })
        })
        await models.thumb_dynamic.create({
          uid: user.uid,
          dynamic_id
        })
      }

      let dynamicLikeCount = await models.thumb_dynamic.count({
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
        message: type === 'like' ? '点赞动态成功' : '取消点赞动态成功'
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

module.exports = Thumb
