"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    // 登陆
    socket.on('loginXiaoSuiBi', (data) => {
        socket[data.uid] = data.uid; // socket.id 赋值给用户
    });
    // 退出（内置事件）
    socket.on('disconnect', (reason) => {
        io.sockets.emit('quit', socket.id);
    });
    // 接收群聊消息
    socket.on('sendMessageGroup', (message) => {
        // 发送文件
        // 普通消息
        io.sockets.emit('sendMessageGroup', message);
    });
};
