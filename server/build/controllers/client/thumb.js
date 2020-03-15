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
const { render, resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const clientWhere = require('../../utils/clientWhere');
const constant_1 = require("../../utils/constant");
const userMessage = require('../../utils/userMessage');
const userVirtual = require('../../common/userVirtual');
const useExperience_1 = __importDefault(require("../../common/useExperience"));
const { TimeNow, TimeDistance } = require('../../utils/time');
class Thumb {
    static setThumb(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { associate_id, type } = req.body;
                const { user = '' } = req;
                let associateType = '';
                if (!constant_1.modelInfo[type]) {
                    throw new Error('类型不存在，系统已禁止行为');
                }
                if (!associate_id) {
                    throw new Error('关联ID不存在');
                }
                const oneModelInfo = yield models[constant_1.modelInfo[type].model].findOne({
                    where: {
                        [constant_1.modelInfo[type].idKey]: associate_id
                    }
                });
                if (!oneModelInfo) {
                    throw new Error('模型不存在');
                }
                let oneAttention = yield models.thumb.findOne({
                    where: {
                        uid: user.uid,
                        type,
                        associate_id
                    }
                });
                if (oneAttention) {
                    /* 判断是否关注了 */
                    associateType = oneAttention.is_associate ? 'cancel' : 'enter';
                    yield models.thumb.update({
                        is_associate: !oneAttention.is_associate
                    }, {
                        where: {
                            uid: user.uid,
                            type,
                            associate_id
                        }
                    });
                }
                else {
                    associateType = 'enter'; // 只在第一次关注的时候提交推送
                    // 订阅消息，只在用户第一关注的时候推送消息
                    yield userMessage.setMessage({
                        uid: oneModelInfo.uid,
                        sender_id: user.uid,
                        action: constant_1.userMessageAction.thumb,
                        type: type,
                        content: associate_id
                    });
                    // 点赞经验
                    if (oneModelInfo.uid !== user.uid) {
                        // 排除自己
                        yield useExperience_1.default.setExperience({
                            uid: oneModelInfo.uid,
                            ass_uid: user.uid,
                            associate: associate_id,
                            type: type,
                            action: constant_1.modelAction.obtain_thumb
                        });
                    }
                    // 创建首次点赞
                    yield models.thumb.create({
                        uid: user.uid,
                        associate_id,
                        type,
                        is_associate: true
                    });
                }
                yield models[constant_1.modelInfo[type].model].update(
                // 更新点赞数
                {
                    thumb_count: associateType === 'enter'
                        ? Number(oneModelInfo.thumb_count) + 1
                        : Number(oneModelInfo.thumb_count) - 1
                }, {
                    where: {
                        [constant_1.modelInfo[type].idKey]: associate_id
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: associateType === 'enter' ? '点赞成功' : '取消点赞成功',
                    data: {
                        type: associateType
                    }
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
exports.default = Thumb;
