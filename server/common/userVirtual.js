const models = require('../../db/mysqldb/index')
const moment = require('moment')
const { virtualInfo, virtualPlusLess } = require('../utils/constant')
const { lowdb } = require('../../db/lowdb/index')
const config = lowdb.read().value()

class userVirtual {
  // 用户消息
  static setVirtual (vrData) {
    let virtualData = vrData
    // 订阅消息
    return new Promise(async (resolve, reject) => {
      let user_info = await models.user_info.findOne({
        where: {
          uid: virtualData.uid
        }
      })
      let balance =
        virtualInfo[virtualData.action].plusLess === virtualPlusLess.plus
          ? user_info.balance +
            virtualInfo[virtualData.action][virtualData.type]
          : user_info.balance -
            virtualInfo[virtualData.action][virtualData.type]
      console.log('balance', balance)
      await models.virtual
        .create({
          // 用户虚拟币消息记录
          plus_less: virtualInfo[virtualData.action].plusLess,
          balance,
          amount: virtualInfo[virtualData.action][virtualData.type],
          ...virtualData
        })
        .then(async result => {
          await models.user_info.update(
            {
              balance: balance
            },
            {
              where: {
                uid: virtualData.uid
              }
            }
          )
          resolve({ status: 'success' })
        })
        .catch(err => {
          reject('虚拟币消费出现错误:' + err)
        })
    })
  }
}

module.exports = userVirtual
