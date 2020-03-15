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
const lowdb = require('../../../db/lowdb');
const kiteConfig = require('../../../kite.config');
const internalConfig = require('../../../config');
const API_VERSION = 'v1'; // 接口版本
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cli = lowdb
    .read()
    .get('cli')
    .value();
const config = lowdb
    .read()
    .get('config')
    .value();
const apiLimiter = express_rate_limit_1.default({
    // [所有请求]限制每个ip，一小时最多1500次请求
    windowMs: 60 * 60 * 1000,
    max: 1500,
    skip: (req, res) => {
        // 获取客户端请求ip
        let ip;
        if (req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].toString().split(",")[0];
        }
        else {
            ip = req.connection.remoteAddress;
        }
        return internalConfig.IPWhitelist.indexOf(ip) != -1 ? true : false;
    }
});
// only apply to requests that begin with /api/
exports.default = (app) => {
    if (cli.is_success) {
        // 项目未进行初始化时 router 是无法载入需要连接数据库的配置的路由
        const apiClient = require('./apiClient');
        const apiAdmin = require('./apiAdmin');
        const client = require('./client');
        const admin = require('./admin');
        const oauth = require('./oauth');
        app.use("/api-client/", apiLimiter);
        app
            .use(`/api-client/${API_VERSION}`, apiClient)
            .use(`/api-client/${API_VERSION}/oauth`, oauth)
            .use(`/api-admin/${API_VERSION}`, apiAdmin)
            .use(`/${config.admin_url}`, admin)
            .use('/', client);
    }
    else {
        console.log('项目还未初始化，请初始化后再继续进行当前操作......');
        console.log(`运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`);
        app.use('*', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            res.send(`项目还未初始化，请初始化后再进行继续操作,运行npm run init 进入初始化，端口号为：${kiteConfig.server.ininProt}`);
        }));
    }
};
