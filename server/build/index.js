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
const kiteConfig = require('../../kite.config');
const routers_1 = __importDefault(require("./routers"));
const index_1 = __importDefault(require("./socket/index"));
const chat_1 = __importDefault(require("./socket/chat"));
const helmet_1 = __importDefault(require("helmet"));
const graphql = require('./graphql');
const lowdb = require('../../db/lowdb');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {});
require('../../db/mysqldb/pool').poolInit();
app.use(helmet_1.default());
const cli = lowdb
    .read()
    .get('cli')
    .value();
io.on('connection', (socket) => {
    index_1.default(io, socket);
});
app.use(body_parser_1.default.json()); //数据JSON类型
app.use(body_parser_1.default.urlencoded({ extended: false })); //解析post请求数据
app.use(cookie_parser_1.default('cookie_kite'));
app.use('/api-client/v1', chat_1.default(io));
// 配置静态资源加载中间件
app.use(express.static(path_1.default.join(__dirname, '../../static')));
app.set('views', path_1.default.join(__dirname, '../../views'));
// 配置服务端模板渲染引擎中间件
app.engine('html', require('ejs').renderFile);
if (cli.is_success)
    graphql(app);
// 加载路由中间件
routers_1.default(app);
// 监听启动端口
// app.listen(kiteConfig.server.port)
server.listen(kiteConfig.server.port, () => {
    console.log(`server is start at port ${kiteConfig.server.port}`);
});
