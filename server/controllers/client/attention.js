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

class Attention {
  /**
   * 用户个人中心个人文章列表render
   * @param   {object} ctx 上下文对象
   */

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
        // 订阅消息，只在用户第一关注的时候推送消息
        await userMessage.setMessage({
          uid: attention_uid,
          sender_id: user.uid,
          action: userMessageAction.attention, // 动作：关注
          type: userMessageType.user // 类型：用户
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
}

module.exports = Attention
