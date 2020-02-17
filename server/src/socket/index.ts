export default (io: any, socket: any) => {
  console.log('111111111111111socket', io.socket)
  // 登陆
  socket.on('loginXiaoSuiBi', (data: any) => {
    socket[data.uid] = data.uid // socket.id 赋值给用户
  })

  socket.on('login', (userInfo: any) => {
    socket.emit('userList', userInfo)
    socket.broadcast.emit('login', userInfo)
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

  socket.on('newMessage', (message: any) => {
    // 发送文件
    console.log('1111111111111111111111111newMessage', message)
    // 普通消息
    io.sockets.emit(message.receive_uid, message)
  })

  // 接收私聊消息
  socket.on('sendMessageMember', (message: any) => {
    // 发送文件
    // 普通消息
    socket.emit('sendMessageMember', message)
    io.to(message.memberId).emit('sendMessageMember', message)
  })
}
