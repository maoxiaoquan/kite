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
const models = require('../../../../db/mysqldb');
const { resAdminJson } = require('../../utils/resData');
class Options {
    /* 创建配置项 */
    static createOptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // 公共创建配置项
            const reqData = req.body;
            try {
                if (!reqData.option_key) {
                    throw new Error('请输入键名!');
                }
                if (!reqData.option_value) {
                    throw new Error('请输入值!');
                }
                yield models.options.create({
                    option_key: reqData.option_key,
                    option_value: reqData.option_value //  值
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '配置创建成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 查询配置项
     * @param   {object} ctx 上下文对象
     */
    static QueryOptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.query;
            try {
                const optionsAll = yield models.options.findAll({
                    where: Object.assign({}, reqData // 查询条件
                    )
                });
                if (optionsAll) {
                    resAdminJson(res, {
                        state: 'success',
                        message: '获取配置项成功',
                        data: optionsAll
                    });
                }
                else {
                    resAdminJson(res, {
                        state: 'error',
                        message: '配置项为空'
                    });
                }
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 更新配置项
     * @param   {object} ctx 上下文对象
     */
    static updateOptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                if (!reqData.option_key) {
                    throw new Error('请输入键名!');
                }
                if (!reqData.option_value) {
                    throw new Error('请输入值!');
                }
                yield yield models.options.update({
                    option_value: reqData.option_value
                }, {
                    where: {
                        option_id: reqData.option_id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新配置项成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 删除配置项
     */
    static deleteOptions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { option_id } = req.body;
            try {
                let oneOptions = yield models.options.findOne({ where: { option_id } });
                if (!oneOptions) {
                    throw new Error('删除项不存在!');
                }
                yield models.options.destroy({ where: { option_id } });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除配置项成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = Options;
