const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction,
  userMessageActionText,
  virtualAction,
  virtualType
} = require('../../utils/constant')

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')

function ErrorMessage(message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class Shop {
  /**
   * 购买
   * @param   {object} ctx 上下文对象
   */
  // 购买操作
  static async Buy(ctx) {
    try {
      let reqData = ctx.request.body
      let { user = '' } = ctx.request
      let user_info = await models.user_info.findOne({
        where: {
          uid: user.uid
        }
      })

      let shell_balance = Number(user_info.shell_balance)
      if (shell_balance < reqData.price) {
      } else {
      }

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
              uid: '',
              ass_uid: '',
              associate: '',
              plus_less: '',
              balance: '',
              income: '',
              expenses: '',
              amount: '',
              type: '',
              action: '',
              description: ''
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
          .then(user => {
            return models.virtual.create(
              {
                // 用户虚拟币消息记录
                uid: '',
                ass_uid: '',
                associate: '',
                plus_less: '',
                balance: '',
                income: '',
                expenses: '',
                amount: '',
                type: '',
                action: '',
                description: ''
              },
              { transaction: t }
            )
          })
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

      resClientJson(ctx, {
        state: 'success',
        data: {},
        message: 'success'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
  /**
   * 我的购买列表
   * @param   {object} ctx 上下文对象
   */
  static async myShopList(ctx) {
    const { dynamic_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneDynamic = await models.dynamic.findOne({
        where: {
          id: dynamic_id
        }
      })
      let oneUserThumbDynamic = await models.thumb_dynamic.findOne({
        where: {
          uid: user.uid,
          dynamic_id
        }
      })

      if (oneUserThumbDynamic) {
        /* 判断是否like动态，是则取消，否则添加 */
        type = 'cancel'
        await models.thumb_dynamic.destroy({
          where: {
            uid: user.uid,
            dynamic_id
          }
        })
      } else {
        type = 'like'
        await userMessage.setMessage({
          uid: oneDynamic.uid,
          sender_id: user.uid,
          action: userMessageAction.thumb, // 动作：点赞
          type: userMessageType.thumb_dynamic, // 类型：点赞动态
          content: JSON.stringify({
            dynamic_id: dynamic_id
          })
        })
        await models.thumb_dynamic.create({
          uid: user.uid,
          dynamic_id
        })
      }

      let dynamicLikeCount = await models.thumb_dynamic.count({
        where: {
          dynamic_id
        }
      })

      await models.dynamic.update(
        {
          like_count: dynamicLikeCount
        },
        { where: { id: dynamic_id } }
      )

      resClientJson(ctx, {
        state: 'success',
        data: {
          type
        },
        message: type === 'like' ? '点赞动态成功' : '取消点赞动态成功'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Shop
