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
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../db/mysqldb/index');
const lowdb = require('../../../db/lowdb/index');
const config = lowdb.read().value();
const constant_1 = require("../utils/constant");
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == '') {
        return false;
    }
    else {
        return true;
    }
}
class userAttentionMessage {
    // 用户关注的消息推送
    static attentionMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, type, action, associate_id } = data;
            let attentionMessage = [];
            const attentionCount = yield models.attention.count({
                where: {
                    associate_id: uid,
                    type: constant_1.modelName.user,
                    is_associate: true
                }
            });
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                // 临时写法
                if (attentionCount > 0) {
                    const allAttention = yield models.attention.findAll({
                        where: {
                            associate_id: uid,
                            type: constant_1.modelName.user,
                            is_associate: true
                        }
                    });
                    for (let i in allAttention) {
                        let j = i;
                        attentionMessage[j] = {};
                        attentionMessage[j]['receive_uid'] = allAttention[j].uid;
                        attentionMessage[j]['sender_uid'] = uid;
                        attentionMessage[j]['type'] = type;
                        attentionMessage[j]['action'] = action;
                        attentionMessage[j]['associate_id'] = associate_id;
                        attentionMessage[j]['is_read'] = false;
                    }
                    // 订阅消息
                    yield models.attention_message.bulkCreate(attentionMessage);
                }
                resolve();
            }));
        });
    }
}
exports.default = userAttentionMessage;
