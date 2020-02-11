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
class AdminSystemLog {
    /**
     * 创建后台日志
     * @param   {object} ctx 上下文对象
     */
    static createAdminSystemLog({ uid, type = 1, content }) {
        return __awaiter(this, void 0, void 0, function* () {
            return models.system_log.create({
                uid,
                type,
                content
            });
        });
    }
    /**
     * 获取后台系统日志操作
     * @param   {object} ctx 上下文对象
     */
    static getAdminSystemLogList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.system_log.findAndCountAll({
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date)
                        .format('YYYY-MM-DD H:m:s')
                        .toLocaleString());
                    rows[i].setDataValue('admin_user', yield models.admin_user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'nickname']
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
     * 删除后台系统日志
     */
    static deleteAdminSystemLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                yield models.system_log.destroy({ where: { id } });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '删除后台系统日志成功'
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
}
exports.default = AdminSystemLog;
