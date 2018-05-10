const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const convert = require('koa-convert')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')

const config = require('../config')
const routers = require('./routers/index')

const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const app = new Koa()

app.use(koaLogger())

app.use(bodyParser())

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST
}

// 存放sessionId的cookie配置
let cookie = {
  domain: 'localhost',    // 写 cookie 所在的域名
  path: '/',              // 写 cookie 所在的路径
  maxAge: 1000 * 60 * 60,      // cookie 有效时长
  httpOnly: true,         // 是否只用于 http 请求中获取
  overwrite: false        // 是否允许重写
}

// 配置session中间件
app.use(session({
  key: 'SID',
  store: new MysqlStore(sessionMysqlConfig),
  cookie: cookie
}))

// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname, '../static')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, '../views'), {
  extension: 'ejs'
}))

// 加载路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

// 监听启动端口
app.listen(config.produce_port)
console.log(`the server is start at port ${config.produce_port}`)
