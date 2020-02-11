const models = require('../../../db/mysqldb/index')
const { sendNotification } = require('./sendEmail')
import moment from 'moment'
const { userMessageIsPush } = require('./constant')
const lowdb = require('../../../db/lowdb/index')
const config = lowdb.read().value()
class userMessage {
  // 用户消息
  static setMessage(msgData: any) {
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
        .then(async (result: any) => {
          // if (
          //   // 本地开发模式不发送消息推送
          //   config.website.website_name // &&
          //   // config.website.website_name.indexOf('localhost') === -1
          // ) {
          //   let msgNum = await models.user_message.count({
          //     where: {
          //       uid: msgData.uid,
          //       is_read: false
          //     }
          //   })
          //   let oneUser = await models.user.findOne({
          //     where: {
          //       uid: msgData.uid
          //     }
          //   })
          //   let oneUserInfo = await models.user_info.findOne({
          //     where: {
          //       uid: msgData.uid
          //     }
          //   })
          //   if (
          //     msgNum > 3 &&
          //     oneUserInfo.is_msg_push === userMessageIsPush.open
          //   ) {
          //     await sendNotification(oneUser.email, '未读消息', {
          //       uid: msgData.uid,
          //       noMsgNum: msgNum,
          //       msg: `你有${msgNum}条未读消息`,
          //       date: currDate
          //     })
          //   }
          // } else {
          //   resolve({
          //     state: 'success',
          //     message: '本地开发模式不发送消息推送'
          //   })
          // }
          resolve({ status: 'success' })
        })
        .catch(() => {
          reject('消息订阅失败')
        })
    })
  }
}

module.exports = userMessage
