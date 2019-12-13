const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualType,
  modelType,
  modelInfo
} = require('../../utils/constant')

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')

function ErrorMessage(message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class Like {
  /**
   * 用户like文章post
   * @param   {object} ctx 上下文对象
   */
  static async setLike(req, res, next) {
    try {
      const { associate_id, type } = req.body
      const { user = '' } = req
      let associateType = ''

      if (!modelInfo[type]) {
        throw new ErrorMessage('类型不存在，系统已禁止行为')
      }
      if (!associate_id) {
        throw new ErrorMessage('关联ID不存在')
      }
      const oneModelInfo = await models[modelInfo[type].model].findOne({
        where: {
          [modelInfo[type].idKey]: associate_id
        }
      })

      if (!oneModelInfo) {
        throw new ErrorMessage('模型不存在')
      }

      let oneAttention = await models.like.findOne({
        where: {
          uid: user.uid,
          type,
          associate_id
        }
      })

      if (oneAttention) {
        /* 判断是否关注了 */
        associateType = oneAttention.is_associate ? 'cancel' : 'enter'
        await models.like.update(
          {
            is_associate: !oneAttention.is_associate
          },
          {
            where: {
              uid: user.uid,
              type,
              associate_id
            }
          }
        )
      } else {
        associateType = 'enter' // 只在第一次关注的时候提交推送
        // 订阅消息，只在用户第一关注的时候推送消息
        await userMessage.setMessage({
          uid: associate_id,
          sender_id: user.uid,
          action: userMessageAction.like, // 动作：喜欢
          type: modelType.article, // 类型：文章
          content: JSON.stringify({
            aid: associate_id
          })
        })
        await models.like.create({
          uid: user.uid,
          associate_id,
          type,
          is_associate: true
        })
      }

      resClientJson(res, {
        state: 'success',
        message: associateType === 'enter' ? '喜欢成功' : '取消喜欢成功',
        data: {
          type: associateType
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Like
