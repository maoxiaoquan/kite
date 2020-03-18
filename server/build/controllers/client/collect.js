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
const shortid = require('shortid');
const lowdb = require('../../../../db/lowdb/index');
const constant_1 = require("../../utils/constant");
const userMessage = require('../../utils/userMessage');
const userVirtual = require('../../common/userVirtual');
const { TimeNow, TimeDistance } = require('../../utils/time');
/* 动态专题模块模块 */
// 获取动态专题详情
class Collect {
    static setCollect(req, res, next) {
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
                    associateType = 'enter'; // 只在第一次收藏的时候提交推送
                    // 收藏，只在用户第一关注的时候推送消息
                    // 订阅消息，只在用户第一关注的时候推送消息
                    yield userMessage.setMessage({
                        uid: oneModelInfo.uid,
                        sender_id: user.uid,
                        action: constant_1.userMessageAction.collect,
                        type: type,
                        content: associate_id
                    });
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
    /**
     * 我的收藏列表
     * @param   {object} ctx 上下文对象
     */
    static getCollectList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let type = req.query.type || '';
            let pageSize = Number(req.query.pageSize) || 10;
            let { user = '' } = req;
            let whereParams = {
                // 查询参数
                is_associate: true,
                uid: user.uid
            };
            type && (whereParams['type'] = type);
            try {
                let { count, rows } = yield models.collect.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_date', 'DESC']]
                });
                for (let i in rows) {
                    let model = constant_1.modelInfo[rows[i].type].model;
                    let idKey = constant_1.modelInfo[rows[i].type].idKey;
                    const info = yield models[model].findOne({
                        where: {
                            [idKey]: rows[i].associate_id
                        }
                    });
                    rows[i].setDataValue('info', info || {});
                }
                resClientJson(res, {
                    state: 'success',
                    data: {
                        count,
                        list: rows,
                        page,
                        pageSize
                    },
                    message: '获取收藏信息成功'
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
