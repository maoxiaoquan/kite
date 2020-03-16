const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const { TimeNow, TimeDistance } = require('../../utils/time')
const clientWhere = require('../../utils/clientWhere')
import {
  statusList,
  modelAction,
  modelActionText,

  modelName,
  modelInfo
} from '../../utils/constant'

class User {
  static async userInfo(uid: any) {
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

  static async userUnreadCount(uid: any) {
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

      let privateChatCount = await models.chat_message.count({
        where: {
          receive_uid: uid,
          is_read: false
        }
      })

      return {
        messageCount: messageCount,
        attentionCount: attentionCount,
        privateChatCount
      }
    } catch (err) {
      return {
        messageCount: 0,
        attentionCount: 0,
        privateChatCount: 0
      }
    }
  }

  static async unreadAttentionMsg({ page = 1, pageSize = 10, uid }: any) {
    // 用户未读关注消息
    try {
      let { count, rows } = await models.attention_message.findAndCountAll({
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
            where: { uid: rows[i].sender_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        rows[i].setDataValue('actionText', modelActionText[rows[i].action])
        rows[i].setDataValue('typeText', modelInfo[rows[i].type].name)

        let model = modelInfo[rows[i].type].model
        let idKey = modelInfo[rows[i].type].idKey
        const associateInfo = await models[model].findOne({
          where: {
            [idKey]: rows[i].associate_id
          }
        })
        rows[i].setDataValue('associateInfo', associateInfo)
      }

      await models.attention_message.update(
        {
          is_read: true
        },
        {
          where: {
            is_read: false,
            receive_uid: uid
          }
        }
      )

      return {
        count,
        list: JSON.parse(JSON.stringify(rows)),
        page,
        pageSize
      }
    } catch (err) {
      console.log('err', err)
      return {
        count: 0,
        list: [],
        page,
        pageSize
      }
    }
  }
}

export default User
