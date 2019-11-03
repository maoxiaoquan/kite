const models = require('../../db/mysqldb/index')
const { sendNotification } = require('./sendEmail')
const moment = require('moment')
const { userMessageIsPush } = require('./constant')
const { lowdb } = require('../../db/lowdb/index')
const config = lowdb.read().value()
class userMessage {
  // 用户消息
  static setMessage (msgData) {
    // 订阅消息
    let date = new Date()
    let currDate = moment(date.setHours(date.getHours())).format(
      'YYYY-MM-DD HH:mm:ss'
    )
    return new Promise(async (resolve, reject) => {
      await models.user_message
        .create({
          // 用户行为记录
          ...msgData
        })
        .then(async result => {
          resolve({ status: 'success' })
        })
        .catch(() => {
          reject('消息订阅失败')
        })
    })
  }
}

module.exports = userMessage
