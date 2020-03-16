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
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const graphql_1 = require("./graphql");
const jwt = require('jsonwebtoken');
const isProd = process.env.NODE_ENV === 'production';
const models = require('../../../db/mysqldb');
/**
 * 中间件
 * 1 自定义context 可以传入ctx对象
 * 2 增加resolve执行的信息
 * 3 自定义日志输出
 * 4 错误处理统一处理
 * @param app
 */
function graphql(app) {
    const server = new ApolloServer({
        introspection: !isProd,
        playground: !isProd,
        debug: !isProd,
        schema: makeExecutableSchema({
            typeDefs: graphql_1.typeDefs,
            resolvers: graphql_1.resolvers
        }),
        context: ({ req, res }) => __awaiter(this, void 0, void 0, function* () {
            // console.log(req.body.query.indexOf('mutation{'));
            // 如果header中，包含access token，那么判断是否有效，无效则拒绝请求
            let user = null;
            let islogin = false;
            let token = req.body.accessToken ||
                req.query.accessToken ||
                req.headers['access-token'] ||
                req.cookies.accessToken;
            // 存在token，解析token
            if (token) {
                yield jwt.verify(token, 'client', (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        islogin = false;
                        user = {};
                    }
                    else {
                        let userInfo = yield models.user.findOne({
                            where: { uid: decoded.uid }
                        });
                        if (userInfo) {
                            islogin = true;
                            user = userInfo;
                        }
                        else {
                            islogin = false;
                            user = {};
                        }
                    }
                }));
            }
            // 获取客户端请求ip
            let ip;
            if (req.headers['x-forwarded-for']) {
                ip = req.headers['x-forwarded-for'].toString().split(',')[0];
            }
            else {
                ip = req.connection.remoteAddress;
            }
            return {
                token,
                user,
                islogin,
                ip,
                req,
                res
            };
        }),
        formatError: (error) => ({
            code: error.extensions.code,
            message: error.message
        })
    });
    server.applyMiddleware({ app, path: '/graphql' });
}
module.exports = graphql;
