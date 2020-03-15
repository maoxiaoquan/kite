export default (io: any, socket: any) => {
  // 登陆
  socket.on('loginXiaoSuiBi', (data: any) => {
    socket[data.uid] = data.uid // socket.id 赋值给用户
    console.log('io.sockets.sockets------------:', io.sockets.sockets)
  })

  // 退出（内置事件）
  socket.on('disconnect', (reason: any) => {
    io.sockets.emit('quit', socket.id)
  })

  // 接收群聊消息
  socket.on('sendMessageGroup', (message: any) => {
    // 发送文件

    // 普通消息
    io.sockets.emit('sendMessageGroup', message)
  })
}
