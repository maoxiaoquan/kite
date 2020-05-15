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
const jwt = require('jsonwebtoken');
const resData = require('./resData');
const _models = require('../../../db/mysqldb');
class Tokens {
    static ClientVerifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqBody = req.body;
            let token = reqBody.accessToken ||
                req.query.accessToken ||
                req.headers['access-token'] ||
                req.cookies.accessToken;
            if (token) {
                // 存在token，解析token
                yield jwt.verify(token, 'client', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        yield resData.resClientJson(res, {
                            state: 'error',
                            message: '当前用户未登陆，请登陆后再次尝试',
                            data: {
                                islogin: false,
                                user: {}
                            }
                        });
                    }
                    else {
                        let userInfo = yield _models.user.findOne({
                            where: { uid: decoded.uid }
                        });
                        if (userInfo) {
                            req.islogin = true;
                            req.user = userInfo;
                        }
                        else {
                            req.islogin = false;
                            req.user = {};
                        }
                        yield next();
                    }
                }));
            }
            else {
                yield resData.resClientJson(res, {
                    state: 'error',
                    message: '当前用户未登陆，请登陆后再次尝试',
                    data: {
                        islogin: false,
                        user: {}
                    }
                });
            }
        });
    }
    static ClientVerifyTokenInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.body.accessToken ||
                req.query.accessToken ||
                req.headers['access-token'] ||
                req.cookies.accessToken;
            // 存在token，解析token
            yield jwt.verify(token, 'client', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    req.islogin = false;
                    req.user = {};
                }
                else {
                    let userInfo = yield _models.user.findOne({
                        where: { uid: decoded.uid }
                    });
                    if (userInfo) {
                        req.islogin = true;
                        req.user = userInfo;
                    }
                    else {
                        req.islogin = false;
                        req.user = {};
                    }
                }
                yield next();
            }));
        });
    }
    static AdminVerifyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqBody = req.body;
            let token = reqBody.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                // 存在token，解析token
                try {
                    req.userInfo = yield jwt.verify(token, 'admin');
                    yield next();
                }
                catch (err) {
                    resData.resAdminJson(res, {
                        state: 'nologin',
                        message: '请登录'
                    }, false);
                }
            }
            else {
                resData.resAdminJson(res, {
                    state: 'nologin',
                    message: '请登录'
                }, false);
            }
        });
    }
    static AdminSetToken(time, data) {
        return jwt.sign(data, 'admin', {
            expiresIn: time
        });
    }
    static ClientSetToken(time, data) {
        return jwt.sign(data, 'client', {
            expiresIn: time
        });
    }
}
module.exports = Tokens;
