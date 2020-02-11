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
const { resAdminJson } = require('../../utils/resData');
const lowdb = require('../../../../db/lowdb/index');
class System {
    /**
     * 获取标分页评论列表操作
     * @param   {object} ctx 上下文对象
     */
    static getSystemInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = lowdb
                    .read()
                    .get('email')
                    .value();
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                const config = lowdb
                    .read()
                    .get('config')
                    .value();
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        email: Object.assign(Object.assign({}, email), { pass: '' }),
                        website,
                        config
                    }
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
     * 更新系统配置
     * @param   {object} ctx 上下文对象
     */
    static updateSystemInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, website, type, config } = req.body;
            try {
                if (type === 'email') {
                    yield lowdb
                        .get('email')
                        .assign(email)
                        .write();
                }
                else if (type === 'website') {
                    yield lowdb
                        .get('website')
                        .assign(website)
                        .write();
                }
                else if (type === 'config') {
                    yield lowdb
                        .get('config')
                        .assign(config)
                        .write();
                }
                resAdminJson(res, {
                    state: 'success',
                    message: '更新系统配置成功'
                });
            }
            catch (e) {
                resAdminJson(res, {
                    state: 'error',
                    message: '更新系统配置失败'
                });
            }
        });
    }
}
exports.default = System;
