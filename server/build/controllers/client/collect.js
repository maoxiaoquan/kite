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
const models = require('../../../../db/mysqldb/index');
const { resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const trimHtml = require('trim-html');
const xss = require('xss');
const clientWhere = require('../../utils/clientWhere');
const config = require('../../../../config');
const { TimeNow, TimeDistance } = require('../../utils/time');
const shortid = require('shortid');
const lowdb = require('../../../../db/lowdb/index');
const { statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes }, articleType, userMessageAction, modelAction, virtualType, modelType, modelInfo } = require('../../utils/constant');
const userVirtual = require('../../common/userVirtual');
/* 动态专题模块模块 */
// 获取动态专题详情
class Collect {
    static setCollect(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { associate_id, type } = req.body;
                const { user = '' } = req;
                let associateType = '';
                if (!modelInfo[type]) {
                    throw new Error('类型不存在，系统已禁止行为');
                }
                if (!associate_id) {
                    throw new Error('关联ID不存在');
                }
                const oneModelInfo = yield models[modelInfo[type].model].findOne({
                    where: {
                        [modelInfo[type].idKey]: associate_id
                    }
                });
                if (!oneModelInfo) {
                    throw new Error('模型不存在');
                }
                if (associate_id === user.uid) {
                    throw new Error('关注用户失败，自己不能关注自己');
                }
                let oneAttention = yield models.collect.findOne({
                    where: {
                        uid: user.uid,
                        type,
                        associate_id
                    }
                });
                if (oneAttention) {
                    /* 判断是否关注了 */
                    associateType = oneAttention.is_associate ? 'cancel' : 'enter';
                    yield models.collect.update({
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
                    yield models.collect.create({
                        uid: user.uid,
                        associate_id,
                        type,
                        is_associate: true
                    });
                }
                resClientJson(res, {
                    state: 'success',
                    message: associateType === 'enter' ? '收藏成功' : '取消收藏成功',
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
exports.default = Collect;
