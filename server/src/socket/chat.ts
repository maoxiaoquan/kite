const express = require('express')
const router = express.Router()

const tokens = require('../utils/tokens') // 登录tokens
const verifyAuthority = require('../utils/verifyAuthority') // 权限验证
const uploadModel = require('../utils/upload')

import chat from '../controllers/client/chat/chat'

export default function(io: any) {
  //管理员登录页面
  router.get('/getEvent', function(req: any, res: any, next: any) {
    io.sockets.emit('notifyNum', { msg_count: '100' })
    res.end('success')
  })

  router.post(
    // 加入私聊建立关系
    '/chat/join-private-chat',
    tokens.ClientVerifyTokenInfo,
    chat.joinPrivateChat
  )

  router.get(
    // 获取私聊列表
    '/chat/get-private-chat-list',
    tokens.ClientVerifyTokenInfo,
    chat.getPrivateChatList
  )

  router.post(
    // 删除私聊
    '/chat/delete-private-chat',
    tokens.ClientVerifyTokenInfo,
    chat.deletePrivateChat
  )

  router.post(
    // 发送私聊
    '/chat/send-private-chat-msg',
    tokens.ClientVerifyTokenInfo,
    (req: any, res: any, next: any) => {
      chat.sendPrivateChatMsg(req, res, next, io)
    }
  )

  return router
}
