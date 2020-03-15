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
const models = require('../../../db/mysqldb/index');
const { sendNotification } = require('./sendEmail');
const moment_1 = __importDefault(require("moment"));
const lowdb = require('../../../db/lowdb/index');
const config = lowdb.read().value();
class userMessage {
    // 用户消息
    static setMessage(msgData) {
        // 订阅消息
        let date = new Date();
        let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield models.user_message
                .create(Object.assign({}, msgData))
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                // if (
                //   // 本地开发模式不发送消息推送
                //   config.website.website_name // &&
                //   // config.website.website_name.indexOf('localhost') === -1
                // ) {
                //   let msgNum = await models.user_message.count({
                //     where: {
                //       uid: msgData.uid,
                //       is_read: false
                //     }
                //   })
                //   let oneUser = await models.user.findOne({
                //     where: {
                //       uid: msgData.uid
                //     }
                //   })
                //   let oneUserInfo = await models.user_info.findOne({
                //     where: {
                //       uid: msgData.uid
                //     }
                //   })
                //   if (
                //     msgNum > 3 &&
                //     oneUserInfo.is_msg_push === userMessageIsPush.open
                //   ) {
                //     await sendNotification(oneUser.email, '未读消息', {
                //       uid: msgData.uid,
                //       noMsgNum: msgNum,
                //       msg: `你有${msgNum}条未读消息`,
                //       date: currDate
                //     })
                //   }
                // } else {
                //   resolve({
                //     state: 'success',
                //     message: '本地开发模式不发送消息推送'
                //   })
                // }
                resolve({ status: 'success' });
            }))
                .catch(() => {
                reject('消息订阅失败');
            });
        }));
    }
}
module.exports = userMessage;
