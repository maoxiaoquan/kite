const models = require('../../db/mysqldb/index')

class userMessage {
  // 用户消息
  static setMessage (msgData) {
    // 订阅消息
    return new Promise(async (resolve, reject) => {
      await models.user_message
        .create({
          // 用户行为记录
          ...msgData
        })
        .then(() => {
          resolve({ status: 'success' })
        })
        .catch(() => {
          reject('消息订阅失败')
        })
    })
  }
}

module.exports = userMessage
