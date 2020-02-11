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
const models = require('../../../../db/mysqldb/index');
const moment_1 = __importDefault(require("moment"));
const { resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const { TimeNow, TimeDistance } = require('../../utils/time');
const clientWhere = require('../../utils/clientWhere');
const { statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes }, articleType, modelAction, modelActionText, virtualType, modelType, modelInfo } = require('../../utils/constant');
class User {
    static userInfo(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            let where = {
                uid
            }; // 排序参数
            try {
                // where
                let oneUser = yield models.user.findOne({
                    where: where,
                    attributes: ['uid', 'avatar', 'nickname', 'user_role_ids']
                });
                let oneUserInfo = yield models.user_info.findOne({
                    where: where,
                    attributes: ['home_page', 'company', 'shell_balance']
                });
                let articleCount = yield models.article.count({
                    where: where // 为空，获取全部，也可以自己添加条件
                });
                let dynamicCount = yield models.dynamic.count({
                    where: where // 为空，获取全部，也可以自己添加条件
                });
                return Object.assign(Object.assign(Object.assign({}, JSON.parse(JSON.stringify(oneUser))), JSON.parse(JSON.stringify(oneUserInfo))), { articleCount,
                    dynamicCount });
            }
            catch (err) {
                return {};
            }
        });
    }
    static userUnreadCount(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // 用户未读消息
            try {
                let messageCount = yield models.user_message.count({
                    where: {
                        uid: uid,
                        is_read: false
                    }
                });
                let attentionCount = yield models.attention_message.count({
                    where: {
                        receive_uid: uid,
                        is_read: false
                    }
                });
                return {
                    messageCount: messageCount,
                    attentionCount: attentionCount
                };
            }
            catch (err) {
                return {
                    messageCount: 0,
                    attentionCount: 0
                };
            }
        });
    }
    static unreadAttentionMsg({ page = 1, pageSize = 10, uid }) {
        return __awaiter(this, void 0, void 0, function* () {
            // 用户未读关注消息
            try {
                let { count, rows } = yield models.attention_message.findAndCountAll({
                    where: {
                        receive_uid: uid
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date).format('YYYY-MM-DD'));
                    rows[i].setDataValue('sender', yield models.user.findOne({
                        where: { uid: rows[i].sender_uid },
                        attributes: ['uid', 'avatar', 'nickname']
                    }));
                    rows[i].setDataValue('actionText', modelActionText[rows[i].action]);
                    rows[i].setDataValue('typeText', modelInfo[rows[i].type].name);
                    let model = modelInfo[rows[i].type].model;
                    let idKey = modelInfo[rows[i].type].idKey;
                    const associateInfo = yield models[model].findOne({
                        where: {
                            [idKey]: rows[i].associate_id
                        }
                    });
                    rows[i].setDataValue('associateInfo', associateInfo);
                }
                yield models.attention_message.update({
                    is_read: true
                }, {
                    where: {
                        is_read: false,
                        receive_uid: uid
                    }
                });
                return {
                    count,
                    list: JSON.parse(JSON.stringify(rows)),
                    page,
                    pageSize
                };
            }
            catch (err) {
                console.log('err', err);
                return {
                    count: 0,
                    list: [],
                    page,
                    pageSize
                };
            }
        });
    }
}
exports.default = User;
