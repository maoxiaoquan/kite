const models = require('../../../../../db/mysqldb/index')
import moment from 'moment'
const { resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../../utils/clientWhere')
const config = require('../../../../../config')
const _ = require('underscore')
const { TimeNow, TimeDistance } = require('../../../utils/time')
const shortid = require('shortid')
const lowdb = require('../../../../../db/lowdb/index')
import { v1 as uuidv1 } from 'uuid'
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  modelAction,
  virtualType,
  modelType,
  modelInfo
} = require('../../../utils/constant')

const userVirtual = require('../../../common/userVirtual')

/* 动态专题模块模块 */
// 获取动态专题详情

class Chat {
  // 获取私聊信息
  static async getPrivateChatInfo(req: any, res: any, next: any) {
    try {
      const { receive_uid } = req.query
      const { user = '' } = req

      let chatContactInfo = await models.chat_contact.findOne({
        where: {
          send_uid: user.uid,
          receive_uid,
          is_associate: true
        }
      })

      if (chatContactInfo) {
        resClientJson(res, {
          data: {
            info: chatContactInfo
          },
          state: 'success'
        })
      } else {
        resClientJson(res, {
          state: 'success'
        })
      }
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async joinPrivateChat(req: any, res: any, next: any) {
    try {
      const { receive_uid } = req.body
      const { user = '' } = req
      if (!receive_uid) {
        throw new Error('加入私聊失败，系统已禁止行为')
      }

      if (receive_uid == user.uid) {
        throw new Error('加入私聊失败，系统已禁止行为')
      }

      let meChatContact = await models.chat_contact.findOne({
        where: {
          send_uid: user.uid,
          receive_uid
        }
      })

      let otherChatContact = await models.chat_contact.findOne({
        where: {
          send_uid: receive_uid,
          receive_uid: user.uid
        }
      })

      if (!meChatContact && !otherChatContact) {
        const uuid = uuidv1()
        await models.chat_contact.create({
          chat_id: uuid,
          send_uid: user.uid,
          receive_uid,
          is_associate: true
        })

        await models.chat_contact.create({
          chat_id: uuid,
          send_uid: receive_uid,
          receive_uid: user.uid,
          is_associate: true
        })
      }

      if (meChatContact) {
        /* 判断是否连接了 */
        await models.chat_contact.update(
          {
            is_associate: true
          },
          {
            where: {
              send_uid: user.uid,
              receive_uid
            }
          }
        )
      }

      if (otherChatContact) {
        /* 判断是否连接了 */
        await models.chat_contact.update(
          {
            is_associate: true
          },
          {
            where: {
              send_uid: receive_uid,
              receive_uid: user.uid
            }
          }
        )
      }

      resClientJson(res, {
        state: 'success'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 获取私聊用户的列表
  static async getPrivateChatList(req: any, res: any, next: any) {
    try {
      const page = req.query.page || 1
      const pageSize = req.query.pageSize || 25
      let orderParams: any[] = [] // 排序参数
      const { user = '' } = req

      let { count, rows } = await models.chat_contact.findAndCountAll({
        where: {
          send_uid: user.uid,
          is_associate: true
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'receive_user',
          await models.user.findOne({
            where: { uid: rows[i].receive_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
      }

      resClientJson(res, {
        data: {
          list: rows,
          count
        },
        state: 'success'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 删除私聊用户的列表
  static async deletePrivateChat(req: any, res: any, next: any) {
    try {
      const { user = '' } = req
      await models.chat_contact.update(
        {
          is_associate: false
        },
        {
          where: {
            send_uid: user.uid,
            is_associate: true
          }
        }
      )

      resClientJson(res, {
        state: 'success',
        message: '删除成功'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async getPrivateChatMsgList(req: any, res: any, next: any) {
    try {
      const page = req.query.page || 1
      const pageSize = req.query.pageSize || 25
      const { receive_uid } = req.query
      let orderParams: any[] = [] // 排序参数
      const { user = '' } = req
      let meChatContact = await models.chat_contact.findOne({
        where: {
          send_uid: user.uid,
          receive_uid
        }
      })

      let { count, rows } = await models.chat_message.findAndCountAll({
        where: {
          chat_id: meChatContact.chat_id
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        rows[i].setDataValue(
          'sendUser',
          await models.user.findOne({
            where: { uid: rows[i].send_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
      }

      resClientJson(res, {
        data: {
          list: rows,
          count,
          page,
          pageSize
        },
        state: 'success'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 发送私聊消息
  static async sendPrivateChatMsg(req: any, res: any, next: any, io: any) {
    try {
      const { receive_uid, message } = req.body
      const { user = '' } = req

      const chatContact = await models.chat_contact.findOne({
        where: {
          send_uid: user.uid,
          receive_uid
        }
      })

      if (!chatContact) {
        throw new Error('私聊失败，请联系管理员修复')
      }

      const userSocket = _.findWhere(io.sockets.sockets, {
        [receive_uid]: receive_uid
      })

      const chatMessage = await models.chat_message.create({
        // 创建消息于系统中
        chat_id: chatContact.chat_id,
        send_uid: user.uid,
        receive_uid,
        content: message,
        is_associate: true
      })

      chatMessage.setDataValue(
        'create_dt',
        await TimeDistance(chatMessage.create_date)
      )

      chatMessage.setDataValue('sendUser', {
        uid: user.uid,
        nickname: user.nickname,
        avatar: user.avatar
      })

      if (userSocket) {
        userSocket.emit('privateMessage', chatMessage)
      }

      resClientJson(res, {
        state: 'success',
        data: chatMessage,
        message: '发送成功'
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

export default Chat
