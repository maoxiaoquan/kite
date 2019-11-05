const models = require('../../db/mysqldb/index')
const moment = require('moment')
const { virtualInfo, virtualPlusLess } = require('../utils/constant')
const { lowdb } = require('../../db/lowdb/index')
const config = lowdb.read().value()

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class userVirtual {
  // 是否可以进行操作
  static isVirtual (vrData) {
    let virtualData = vrData
    // 订阅消息
    return new Promise(async (resolve, reject) => {
      let user_info = await models.user_info.findOne({
        where: {
          uid: virtualData.uid
        }
      })
      let isPlus =
        virtualInfo[virtualData.action].plusLess === virtualPlusLess.plus
      let amount = virtualInfo[virtualData.action][virtualData.type]
      let shell_balance = Number(user_info.shell_balance)
      if (!isPlus) {
        if (shell_balance < amount) {
          resolve(false)
        } else {
          resolve(true)
        }
      } else {
        resolve(true)
      }
    })
  }

  // 用户消息
  static setVirtual (vrData) {
    let virtualData = vrData
    // 订阅消息
    return new Promise(async (resolve, reject) => {
      try {
        let user_info = await models.user_info.findOne({
          where: {
            uid: virtualData.uid
          }
        })
        let isPlus =
          virtualInfo[virtualData.action].plusLess === virtualPlusLess.plus
        let amount = virtualInfo[virtualData.action][virtualData.type]
        let shell_balance = Number(user_info.shell_balance)
        let balance = isPlus ? shell_balance + amount : shell_balance - amount

        if (!isPlus) {
          if (shell_balance < amount) {
            throw new ErrorMessage('积分余额不足')
          }
        }

        await models.sequelize.transaction(t => {
          // 在事务中执行操作
          return models.virtual
            .create(
              {
                // 用户虚拟币消息记录
                plus_less: virtualInfo[virtualData.action].plusLess,
                balance,
                income: isPlus
                  ? virtualInfo[virtualData.action][virtualData.type]
                  : 0,
                expenses: isPlus
                  ? 0
                  : virtualInfo[virtualData.action][virtualData.type],
                amount: virtualInfo[virtualData.action][virtualData.type],
                ...virtualData
              },
              { transaction: t }
            )
            .then(user => {
              return models.user_info.update(
                {
                  shell_balance: balance
                },
                {
                  where: {
                    uid: virtualData.uid
                  }
                },
                { transaction: t }
              )
            })
        })

        resolve({ status: 'success' })
      } catch (err) {
        console.log('err', err)
        reject('虚拟币消费出现错误:' + err.message)
      }
    })
  }
}

module.exports = userVirtual
