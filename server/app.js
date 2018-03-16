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

// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname, '../static')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, '../views'), {
  extension: 'ejs'
}))

// 加载路由中间件
app.use(routers.routes()).use(routers.allowedMethods());

// 监听启动端口
app.listen(config.produce_port);
console.log(`the server is start at port ${config.produce_port}`)
