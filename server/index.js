const app = require('./app')
const path = require('path')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const kiteConfig = require('../kite.config')
const routers = require('./routers')
const graphql = require('./graphql')
const { lowdb } = require('../db/lowdb')
const cli = lowdb
  .read()
  .get('cli')
  .value()
require('../db/mysqldb/pool').poolInit()

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
if (cli.is_success) {
  graphql(app)
}
// 加载路由中间件
app.use(routers.routes())
app.use(routers.allowedMethods())

// 监听启动端口
app.listen(kiteConfig.server.port)

console.log(`server is start at port ${kiteConfig.server.port}`)
