const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../config')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction
} = require('../../utils/constant')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

/* 动态专题模块模块 */

// 获取动态专题详情

class dynamicTopic {
  static async getDynamicTopicInfo (ctx) {
    const { topic_id } = ctx.query
    try {
      const oneDynamicTopic = await models.dynamic_topic.findOne({
        where: {
          topic_id
        }
      })
      oneDynamicTopic.setDataValue(
        'dynamic_count',
        await models.dynamic.count({
          where: { topic_ids: oneDynamicTopic.topic_id }
        })
      )

      resClientJson(ctx, {
        state: 'success',
        data: {
          info: oneDynamicTopic
        },
        message: '动态专题详情获取成功'
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

module.exports = dynamicTopic
