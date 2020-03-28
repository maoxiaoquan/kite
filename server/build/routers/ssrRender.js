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
const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const config = require('../../../config');
const { createBundleRenderer } = require('vue-server-renderer');
const { theme } = require('../../../db/lowdb')
    .read()
    .get('config')
    .value();
const THEME_NAME = theme || 'default';
// 缓存
const microCache = new LRU({
    max: 100,
    maxAge: 1000 * 60 // 重要提示：条目在 1 秒后过期。
});
const isCacheable = (req, res, next) => {
    // 实现逻辑为，检查请求是否是用户特定(user-specific)。
    // 只有非用户特定(non-user-specific)页面才会缓存
    if (~config.cacheable_list.indexOf(req.url)) {
        return true;
    }
    return false;
};
let renderer;
const templatePath = path.resolve(__dirname, `../../../static/theme/${THEME_NAME}/index.html`);
// 第 2步：根据环境变量生成不同BundleRenderer实例
// 获取客户端、服务器端打包生成的json文件
const serverBundle = require(`../../../static/theme/${THEME_NAME}/vue-ssr-server-bundle.json`);
const clientManifest = require(`../../../static/theme/${THEME_NAME}/vue-ssr-client-manifest.json`);
// 赋值
renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template: fs.readFileSync(templatePath, 'utf-8'),
    clientManifest
});
const render = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'text/html');
    let accessToken = req.cookies.accessToken || '';
    const handleError = (err) => {
        if (err.code === 404) {
            const html = fs.readFileSync(path.resolve(__dirname, '../../../views/404.html'), 'utf-8');
            res.status(404);
            res.send(html);
        }
        else {
            res.status(500);
            res.send('500 Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    };
    const context = {
        url: req.url,
        accessToken: accessToken
    };
    // 判断是否可缓存，可缓存并且缓存中有则直接返回
    const cacheable = isCacheable(req, res, next);
    if (cacheable) {
        const hit = microCache.get(req.url);
        if (hit) {
            console.log('从缓存中取', hit);
            res.send(hit);
        }
    }
    try {
        const html = yield renderer.renderToString(context);
        res.send(html);
        if (cacheable) {
            console.log('设置缓存: ', req.url);
            microCache.set(req.url, html);
        }
    }
    catch (error) {
        handleError(error);
    }
});
module.exports = render;
