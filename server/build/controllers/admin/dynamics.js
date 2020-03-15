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
const { resAdminJson } = require('../../utils/resData');
const moment_1 = __importDefault(require("moment"));
const Op = require('sequelize').Op;
class Dynamics {
    /**
     * 获取用户列表操作
     * @param   {object} ctx 上下文对象
     */
    static getDynamicList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10, content, status, type } = req.body;
            let whereParams = {}; // 定义查询条件
            content && (whereParams['content'] = { [Op.like]: `%${content}%` });
            status && (whereParams['status'] = status);
            type && (whereParams['type'] = type);
            try {
                let { count, rows } = yield models.dynamic.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date)
                        .format('YYYY-MM-DD H:m:s')
                        .toLocaleString());
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                }
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        list: rows
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
            }
        });
    }
    /**
     * 更新动态
     * @param   {object} ctx 上下文对象
     */
    static updateDynamic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status, type, rejection_reason, topic_ids } = req.body;
            try {
                yield models.dynamic.update({
                    status,
                    type,
                    rejection_reason,
                    topic_ids
                }, {
                    where: {
                        id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新动态成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
            }
        });
    }
    /**
     * 删除动态
     * @param   {object} ctx 上下文对象
     * 删除动态判断是否有动态
     * 无关联则直接删除动态，有关联则开启事务同时删除与动态的关联
     */
    static deleteDynamic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                let oneDynamic = yield models.dynamic.findOne({ where: { id } });
                if (oneDynamic) {
                    yield models.dynamic.destroy({ where: { id } });
                    resAdminJson(res, {
                        state: 'success',
                        message: '删除动态成功'
                    });
                }
                else {
                    throw new Error('删除动态失败!');
                }
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
            }
        });
    }
}
exports.default = Dynamics;
