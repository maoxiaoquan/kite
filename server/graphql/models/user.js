const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const { TimeNow, TimeDistance } = require('../../utils/time')
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  modelAction,
  modelActionText,
  virtualType,
  modelType,
  modelInfo
} = require('../../utils/constant')

class User {
  static async userInfo(uid) {
    let where = {
      uid
    } // 排序参数
    try {
      // where
      let oneUser = await models.user.findOne({
        where: where, // 为空，获取全部，也可以自己添加条件
        attributes: ['uid', 'avatar', 'nickname', 'user_role_ids']
      })
      let oneUserInfo = await models.user_info.findOne({
        where: where, // 为空，获取全部，也可以自己添加条件
        attributes: ['home_page', 'company', 'shell_balance']
      })

      let articleCount = await models.article.count({
        where: where // 为空，获取全部，也可以自己添加条件
      })

      let dynamicCount = await models.dynamic.count({
        where: where // 为空，获取全部，也可以自己添加条件
      })

      return {
        ...JSON.parse(JSON.stringify(oneUser)),
        ...JSON.parse(JSON.stringify(oneUserInfo)),
        articleCount,
        dynamicCount
      }
    } catch (err) {
      return {}
    }
  }

  static async userUnreadCount(uid) {
    // 用户未读消息
    try {
      let messageCount = await models.user_message.count({
        where: {
          uid: uid,
          is_read: false
        }
      })
      let attentionCount = await models.attention_message.count({
        where: {
          receive_uid: uid,
          is_read: false
        }
      })
      return {
        messageCount: messageCount,
        attentionCount: attentionCount
      }
    } catch (err) {
      return {}
    }
  }

  static async unreadAttentionMsg({ page = 1, pageSize = 10, uid }) {
    // 用户未读关注消息
    try {
      await models.user_message.findAll({
        // 获取所有未读消息id
        where: {
          is_read: false,
          receive_uid: uid
        }
      })

      let { count, rows } = await models.user_message.findAndCountAll({
        where: {
          receive_uid: uid
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date).format('YYYY-MM-DD')
        )
        rows[i].setDataValue(
          'sender',
          await models.user.findOne({
            where: { uid: rows[i].sender_id },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        rows[i].setDataValue('actionText', modelActionText[rows[i].action])
        let model = modelInfo[rows[i].type].model
        let idKey = modelInfo[rows[i].type].idKey
        const productInfo = await models[model].findOne({
          where: {
            [idKey]: rows[i].product_id
          }
        })
        rows[i].setDataValue('productInfo', productInfo)
      }
      return {
        count,
        list: rows,
        page,
        pageSize
      }
    } catch (err) {
      return {
        count: 0,
        list: [],
        page,
        pageSize
      }
    }
  }
}

module.exports = User
