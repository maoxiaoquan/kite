const express = require('express')
const router = express.Router()

export default function(io: any, socket: any) {
  //管理员登录页面
  router.get('/getEvent', function(req: any, res: any, next: any) {
    io.sockets.emit('notifyNum', { msg_count: '100' })
    res.end('success')
  })

  return router
}
