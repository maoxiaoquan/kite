const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const convert = require('koa-convert');
const views = require('koa-views');
const koaStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');

const config = require('../config');
const routers = require('./routers/index');

const app = new Koa();

app.use(koaLogger());

app.use(bodyParser());

app.use(koaStatic(path.join(__dirname, '../public/')));

app.use(views(path.join(__dirname, '../theme'), { extension: 'ejs' }));

// 加载路由中间件
app.use(routers.routes()).use(routers.allowedMethods());

// 监听启动端口
app.listen(config.port);
console.log(`the server is start at port ${config.port}`)
