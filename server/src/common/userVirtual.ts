const models = require('../../../db/mysqldb/index')
import moment from 'moment'
const { virtualInfo, virtualPlusLess } = require('../utils/constant')
const lowdb = require('../../../db/lowdb/index')
const config = lowdb.read().value()

function isDigit(value: any) {
  var patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value == '') {
    return false
  } else {
    return true
  }
}

class userVirtual {
  // 是否可以进行操作
  static isVirtual(vrData: any) {
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

  // 用户消费积分
  static setVirtual(vrData: any) {
    let virtualData = vrData
    // 消费
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

        if (!isDigit(balance)) {
          throw new Error('贝壳支付出现错误')
        }

        if (!isPlus) {
          if (shell_balance < amount) {
            throw new Error('积分余额不足')
          }
        }

        await models.sequelize.transaction((t: any) => {
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
            .then((user: any) => {
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

export default userVirtual
