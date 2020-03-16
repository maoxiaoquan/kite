const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
import {
  userMessageAction,
  userMessageActionText,
  modelAction,
  modelName,
  modelInfo
} from '../../utils/constant'

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')
import useExperience from '../../common/useExperience'
const { TimeNow, TimeDistance } = require('../../utils/time')

class Thumb {
  static async setThumb(req: any, res: any, next: any) {
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

      let oneAttention = await models.thumb.findOne({
        where: {
          uid: user.uid,
          type,
          associate_id
        }
      })

      if (oneAttention) {
        /* 判断是否关注了 */
        associateType = oneAttention.is_associate ? 'cancel' : 'enter'
        await models.thumb.update(
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
          uid: oneModelInfo.uid,
          sender_id: user.uid,
          action: userMessageAction.thumb, // 动作：点赞
          type: type, // 类型：点赞
          content: associate_id
        })

        // 点赞经验
        if (oneModelInfo.uid !== user.uid) {
          // 排除自己
          await useExperience.setExperience({
            uid: oneModelInfo.uid,
            ass_uid: user.uid,
            associate: associate_id,
            type: type,
            action: modelAction.obtain_thumb
          })
        }

        // 创建首次点赞
        await models.thumb.create({
          uid: user.uid,
          associate_id,
          type,
          is_associate: true
        })
      }

      await models[modelInfo[type].model].update(
        // 更新点赞数
        {
          thumb_count:
            associateType === 'enter'
              ? Number(oneModelInfo.thumb_count) + 1
              : Number(oneModelInfo.thumb_count) - 1
        },
        {
          where: {
            [modelInfo[type].idKey]: associate_id
          }
        }
      )

      resClientJson(res, {
        state: 'success',
        message: associateType === 'enter' ? '点赞成功' : '取消点赞成功',
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

export default Thumb
