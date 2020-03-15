"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../../db/mysqldb/index');
const { resClientJson } = require('../../../utils/resData');
const Op = require('sequelize').Op;
const trimHtml = require('trim-html');
const xss = require('xss');
const clientWhere = require('../../../utils/clientWhere');
const config = require('../../../../../config');
const _ = require('underscore');
const { TimeNow, TimeDistance } = require('../../../utils/time');
const shortid = require('shortid');
const lowdb = require('../../../../../db/lowdb/index');
const uuid_1 = require("uuid");
const constant_1 = require("../../../utils/constant");
const userVirtual_1 = __importDefault(require("../../../common/userVirtual"));
/* 动态专题模块模块 */
// 获取动态专题详情
class Chat {
    // 获取私聊信息
    static getPrivateChatInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receive_uid } = req.query;
                const { user = '' } = req;
                let chatContactInfo = yield models.chat_contact.findOne({
                    where: {
                        send_uid: user.uid,
                        receive_uid,
                        is_associate: true
                    }
                });
                if (chatContactInfo) {
                    resClientJson(res, {
                        data: {
                            info: chatContactInfo
                        },
                        state: 'success'
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'success'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    static joinPrivateChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receive_uid } = req.body;
                const { user = '' } = req;
                if (!receive_uid) {
                    throw new Error('加入私聊失败，系统已禁止行为');
                }
                if (receive_uid == user.uid) {
                    throw new Error('加入私聊失败，系统已禁止行为');
                }
                let meChatContact = yield models.chat_contact.findOne({
                    where: {
                        send_uid: user.uid,
                        receive_uid
                    }
                });
                let otherChatContact = yield models.chat_contact.findOne({
                    where: {
                        send_uid: receive_uid,
                        receive_uid: user.uid
                    }
                });
                if (!meChatContact && !otherChatContact) {
                    const uuid = uuid_1.v1();
                    yield models.chat_contact.create({
                        chat_id: uuid,
                        send_uid: user.uid,
                        receive_uid,
                        is_associate: true
                    });
                    yield models.chat_contact.create({
                        chat_id: uuid,
                        send_uid: receive_uid,
                        receive_uid: user.uid,
                        is_associate: true
                    });
                }
                if (meChatContact) {
                    /* 判断是否连接了 */
                    yield models.chat_contact.update({
                        is_associate: true
                    }, {
                        where: {
                            send_uid: user.uid,
                            receive_uid
                        }
                    });
                }
                if (otherChatContact) {
                    /* 判断是否连接了 */
                    yield models.chat_contact.update({
                        is_associate: true
                    }, {
                        where: {
                            send_uid: receive_uid,
                            receive_uid: user.uid
                        }
                    });
                }
                resClientJson(res, {
                    state: 'success'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    // 获取私聊用户的列表
    static getPrivateChatList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const pageSize = req.query.pageSize || 25;
                let orderParams = []; // 排序参数
                const { user = '' } = req;
                let { count, rows } = yield models.chat_contact.findAndCountAll({
                    where: {
                        send_uid: user.uid,
                        is_associate: true
                    },
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: orderParams
                });
                for (let i in rows) {
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].receive_uid },
                        attributes: ['uid', 'avatar', 'nickname']
                    }));
                    rows[i].setDataValue('unreadNum', yield models.chat_message.count({
                        where: {
                            chat_id: rows[i].chat_id,
                            receive_uid: user.uid,
                            is_read: false
                        }
                    }));
                }
                resClientJson(res, {
                    data: {
                        list: rows,
                        count
                    },
                    state: 'success'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    // 删除私聊用户的列表
    static deletePrivateChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user = '' } = req;
                yield models.chat_contact.update({
                    is_associate: false
                }, {
                    where: {
                        send_uid: user.uid,
                        is_associate: true
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '删除成功'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    // 删除私聊用户的列表
    static privateChatRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chat_id } = req.body;
                const { user = '' } = req;
                let meChatContact = yield models.chat_contact.findOne({
                    where: {
                        send_uid: user.uid,
                        chat_id: chat_id
                    }
                });
                if (!meChatContact) {
                    throw new Error('消息阅读失败');
                }
                yield models.chat_message.update({
                    is_read: true
                }, {
                    where: {
                        chat_id: chat_id,
                        receive_uid: user.uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '阅读成功'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    static getPrivateChatMsgList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const pageSize = req.query.pageSize || 25;
                const { receive_uid } = req.query;
                let orderParams = [['create_date', 'DESC']]; // 排序参数
                const { user = '' } = req;
                let meChatContact = yield models.chat_contact.findOne({
                    where: {
                        send_uid: user.uid,
                        receive_uid
                    }
                });
                let { count, rows } = yield models.chat_message.findAndCountAll({
                    where: {
                        chat_id: meChatContact.chat_id
                    },
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: orderParams
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('sendUser', yield models.user.findOne({
                        where: { uid: rows[i].send_uid },
                        attributes: ['uid', 'avatar', 'nickname']
                    }));
                }
                resClientJson(res, {
                    data: {
                        list: rows,
                        count,
                        page,
                        pageSize
                    },
                    state: 'success'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    // 发送私聊消息
    static sendPrivateChatMsg(req, res, next, io) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { receive_uid, message } = req.body;
                const { user = '' } = req;
                if (user.uid == receive_uid) {
                    throw new Error('自己不可以和自己发消息');
                }
                if (!message || message.length <= 0) {
                    throw new Error('请输入聊天消息');
                }
                // 虚拟币判断是否可以进行继续的操作
                const isVirtual = yield userVirtual_1.default.isVirtual({
                    uid: user.uid,
                    type: constant_1.modelName.chat_message,
                    action: constant_1.modelAction.sendPrivateChat
                });
                if (!isVirtual) {
                    throw new Error('贝壳余额不足！');
                }
                const chatContact = yield models.chat_contact.findOne({
                    where: {
                        send_uid: user.uid,
                        receive_uid
                    }
                });
                if (!chatContact) {
                    throw new Error('私聊失败，请联系管理员修复');
                }
                const userSocket = _.findWhere(io.sockets.sockets, {
                    [receive_uid]: receive_uid
                });
                const chatMessage = yield models.chat_message.create({
                    // 创建消息于系统中
                    chat_id: chatContact.chat_id,
                    send_uid: user.uid,
                    receive_uid,
                    content: message,
                    is_associate: true
                });
                chatMessage.setDataValue('create_dt', yield TimeDistance(chatMessage.create_date));
                chatMessage.setDataValue('sendUser', {
                    uid: user.uid,
                    nickname: user.nickname,
                    avatar: user.avatar
                });
                if (userSocket) {
                    userSocket.emit('privateMessage', chatMessage);
                }
                yield userVirtual_1.default.setVirtual({
                    // 私聊消耗
                    uid: user.uid,
                    associate: chatMessage.id,
                    type: constant_1.modelName.chat_message,
                    action: constant_1.modelAction.sendPrivateChat,
                    ass_uid: receive_uid
                });
                resClientJson(res, {
                    state: 'success',
                    data: chatMessage,
                    message: '发送成功'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = Chat;
