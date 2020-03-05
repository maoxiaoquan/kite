const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualType,
  modelType,
  modelInfo
} = require('../../utils/constant')

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')
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
  static async setAttention(req: any, res: any, next: any) {
    try {
      const { associate_id, type } = req.body
      const { user = '' } = req
      let associateType = ''
      if (!modelInfo[type]) {
        throw new Error('类型不存在，系统已禁止行为')
      }
      if (!associate_id) {
        throw new Error('关联ID不存在')
      }
      const oneModelInfo = await models[modelInfo[type].model].findOne({
        where: {
          [modelInfo[type].idKey]: associate_id
        }
      })

      if (!oneModelInfo) {
        throw new Error('模型不存在')
      }

      if (associate_id === user.uid) {
        throw new Error('关注用户失败，自己不能关注自己')
      }

      let oneAttention = await models.attention.findOne({
        where: {
          uid: user.uid,
          type,
          associate_id
        }
      })

      if (oneAttention) {
        /* 判断是否关注了 */
        associateType = oneAttention.is_associate ? 'cancel' : 'enter'
        await models.attention.update(
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
          action: userMessageAction.attention, // 动作：关注
          type: modelType.user // 类型：用户
        })
        await models.attention.create({
          uid: user.uid,
          associate_id,
          type,
          is_associate: true
        })
      }

      resClientJson(res, {
        state: 'success',
        message: associateType === 'enter' ? '关注成功' : '取消关注成功',
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

export default Attention
