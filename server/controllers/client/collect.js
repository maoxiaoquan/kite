const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../config')
const { TimeNow, TimeDistance } = require('../../utils/time')
const shortid = require('shortid')
const { lowdb } = require('../../../db/lowdb/index')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  virtualAction,
  virtualType,
  modelType,
  modelInfo
} = require('../../utils/constant')

const userVirtual = require('../../common/userVirtual')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

/* 动态专题模块模块 */

// 获取动态专题详情

class Collect {
  static async setCollect (req, res, next) {
    try {
      const { associate_id, type } = req.body
      const { user = '' } = req
      let associateType = ''
      if (!modelInfo[type]) {
        throw new ErrorMessage('类型不存在，系统已禁止行为')
      }
      if (!associate_id) {
        throw new ErrorMessage('关联ID不存在')
      }
      const oneModelInfo = await models[modelInfo[type].model].findOne({
        where: {
          [modelInfo[type].idKey]: associate_id
        }
      })

      if (!oneModelInfo) {
        throw new ErrorMessage('模型不存在')
      }

      if (associate_id === user.uid) {
        throw new ErrorMessage('关注用户失败，自己不能关注自己')
      }

      let oneAttention = await models.collect.findOne({
        where: {
          uid: user.uid,
          type,
          associate_id
        }
      })

      if (oneAttention) {
        /* 判断是否关注了 */
        associateType = oneAttention.is_associate ? 'cancel' : 'enter'
        await models.collect.update(
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
        await models.collect.create({
          uid: user.uid,
          associate_id,
          type,
          is_associate: true
        })
      }

      resClientJson(res, {
        state: 'success',
        message: associateType === 'enter' ? '收藏成功' : '取消收藏成功',
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

module.exports = Collect
