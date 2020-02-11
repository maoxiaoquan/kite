"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Express, Request, Response, NextFunction } from 'express'
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const express = require('express');
const app = express();
const kiteConfig = require('../../kite.config');
const routers_1 = __importDefault(require("./routers"));
const graphql = require('./graphql');
const lowdb = require('../../db/lowdb');
const cli = lowdb
    .read()
    .get('cli')
    .value();
require('../../db/mysqldb/pool').poolInit();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default('cookie_kite'));
// 配置静态资源加载中间件
app.use(express.static(path_1.default.join(__dirname, '../../static')));
if (cli.is_success) {
    graphql(app);
}
// 加载路由中间件
routers_1.default(app);
// 监听启动端口
app.listen(kiteConfig.server.port);
console.log(`server is start at port ${kiteConfig.server.port}`);
