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
const path = require('path');
const fs = require('fs');
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
                const oauth = lowdb
                    .read()
                    .get('oauth')
                    .value();
                const storage = lowdb
                    .read()
                    .get('storage')
                    .value();
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        email: Object.assign(Object.assign({}, email), { pass: '' }),
                        website,
                        config,
                        oauth,
                        storage
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
            const { email, website, type, config, oauth, storage } = req.body;
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
                else if (type === 'oauth') {
                    yield lowdb
                        .get('oauth')
                        .assign(oauth)
                        .write();
                }
                else if (type === 'storage') {
                    yield lowdb
                        .get('storage')
                        .assign(storage)
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
    /**
     * 获取标分页评论列表操作
     * @param   {object} ctx 上下文对象
     */
    static getSystemTheme(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let list = [];
                const themeList = yield new Promise((resolve, reject) => {
                    return fs.readdir(path.resolve(__dirname, '../../../../static/theme/'), (err, filenames) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(filenames);
                        }
                    });
                });
                for (let i in themeList) {
                    if (!~themeList[i].indexOf('.')) {
                        list.push(themeList[i]);
                    }
                }
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        list
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err
                });
                return false;
            }
        });
    }
}
exports.default = System;
