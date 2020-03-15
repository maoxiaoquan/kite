const models = require('../../../db/mysqldb/index')
import moment from 'moment'

const lowdb = require('../../../db/lowdb/index')
const config = lowdb.read().value()

import {
  statusList,
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualPlusLess,
  virtualInfo,
  modelName,
  modelInfo
} from '../utils/constant'

function isDigit(value: any) {
  var patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value == '') {
    return false
  } else {
    return true
  }
}

class userAttentionMessage {
  // 用户关注的消息推送
  static async attentionMessage(data: any) {
    const { uid, type, action, associate_id } = data
    let attentionMessage: any[] = []
    const attentionCount = await models.attention.count({
      where: {
        associate_id: uid,
        type: modelName.user,
        is_associate: true
      }
    })

    return new Promise(async (resolve, reject) => {
      // 临时写法
      if (attentionCount > 0) {
        const allAttention = await models.attention.findAll({
          where: {
            associate_id: uid,
            type: modelName.user,
            is_associate: true
          }
        })

        for (let i in allAttention) {
          let j: any = i
          attentionMessage[j] = {}
          attentionMessage[j]['receive_uid'] = allAttention[j].uid
          attentionMessage[j]['sender_uid'] = uid
          attentionMessage[j]['type'] = type
          attentionMessage[j]['action'] = action
          attentionMessage[j]['associate_id'] = associate_id
          attentionMessage[j]['is_read'] = false
        }
        // 订阅消息
        await models.attention_message.bulkCreate(attentionMessage)
      }
      resolve()
    })
  }
}

export default userAttentionMessage
