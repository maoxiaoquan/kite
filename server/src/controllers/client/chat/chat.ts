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
  static async joinPrivateChat(req: any, res: any, next: any) {
    try {
      const { send_uid, receive_uid } = req.body
      const { user = '' } = req
      if (!send_uid || !receive_uid) {
        throw new Error('加入私聊失败，系统已禁止行为')
      }

      let meChatContact = await models.chat_contact.findOne({
        where: {
          send_uid,
          receive_uid
        }
      })

      let otherChatContact = await models.chat_contact.findOne({
        where: {
          send_uid: receive_uid,
          receive_uid: send_uid
        }
      })

      if (meChatContact) {
        /* 判断是否连接了 */
        await models.chat_contact.update(
          {
            is_associate: !meChatContact.is_associate
          },
          {
            where: {
              send_uid,
              receive_uid
            }
          }
        )
      } else {
        await models.chat_contact.create({
          send_uid,
          receive_uid,
          is_associate: true
        })
      }

      if (otherChatContact) {
        /* 判断是否连接了 */
        await models.chat_contact.update(
          {
            is_associate: !otherChatContact.is_associate
          },
          {
            where: {
              send_uid: receive_uid,
              receive_uid: send_uid
            }
          }
        )
      } else {
        await models.chat_contact.create({
          send_uid: receive_uid,
          receive_uid: send_uid,
          is_associate: true
        })
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
      const { user = '' } = req
      await models.chat_contact.findAll({
        send_uid: user.uid,
        is_associate: true
      })

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

  // 发送私聊消息
  static async sendPrivateChatMsg(req: any, res: any, next: any, io: any) {
    try {
      const { receive_uid, message } = req.body
      const { user = '' } = req
      const toSocket = _.findWhere(io.sockets.sockets, {
        [receive_uid]: receive_uid
      })

      if (toSocket) {
        toSocket.emit('privateMessage', {
          message
        })
      }
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
}

export default Chat
