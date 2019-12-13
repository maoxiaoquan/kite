const models = require('../../db/mysqldb/index')
const moment = require('moment')
const { virtualInfo, virtualPlusLess } = require('../utils/constant')
const { lowdb } = require('../../db/lowdb/index')
const config = lowdb.read().value()

const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualType,
  modelType,
  modelInfo
} = require('../utils/constant')

function ErrorMessage(message) {
  this.message = message
  this.name = 'UserException'
}

function isDigit(value) {
  var patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value == '') {
    return false
  } else {
    return true
  }
}

class userAttentionMessage {
  // 用户关注的消息推送
  static async attentionMessage(data) {
    const { uid, type, action, associate_id } = data
    let attentionMessage = []
    const attentionCount = await models.attention.count({
      where: {
        associate_id: uid,
        type: modelType.user,
        is_associate: true
      }
    })

    return new Promise(async (resolve, reject) => {
      // 临时写法
      if (attentionCount > 0) {
        const allAttention = await models.attention.findAll({
          where: {
            associate_id: uid,
            type: modelType.user,
            is_associate: true
          }
        })

        for (let i in allAttention) {
          attentionMessage[i] = {}
          attentionMessage[i]['receive_uid'] = allAttention[i].uid
          attentionMessage[i]['sender_uid'] = uid
          attentionMessage[i]['type'] = type
          attentionMessage[i]['action'] = action
          attentionMessage[i]['associate_id'] = associate_id
          attentionMessage[i]['is_read'] = false
        }
        // 订阅消息
        await models.attention_message.bulkCreate(attentionMessage)
      }
      resolve()
    })
  }
}

module.exports = userAttentionMessage
