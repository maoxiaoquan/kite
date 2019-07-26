const path = require('path')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const app = require('./app')
const kiteConfig = require('../kite.config')
const routers = require('./routers/init')

// 此文件是项目用来初始化时的文件
app.use(koaLogger())
app.use(bodyParser())
// 配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname, '../static')))
// 配置服务端模板渲染引擎中间件
app.use(
  views(path.join(__dirname, '../views'), {
    map: { html: 'ejs' }
  })
)
// 加载路由中间件
app.use(routers.routes()).use(routers.allowedMethods())
// 监听启动端口
app.listen(kiteConfig.server.ininProt) // 项目初始化监听的端口号
console.log(
  `Initialization mode in progress...... 
port ：${kiteConfig.server.ininProt}`
)
