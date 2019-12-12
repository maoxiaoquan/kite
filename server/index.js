const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')
const kiteConfig = require('../kite.config')
const routers = require('./routers')
const graphql = require('./graphql')
const { lowdb } = require('../db/lowdb')
const cli = lowdb
  .read()
  .get('cli')
  .value()
require('../db/mysqldb/pool').poolInit()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
// 配置静态资源加载中间件

app.use(express.static(path.join(__dirname, '../static')))

if (cli.is_success) {
  graphql(app)
}
// 加载路由中间件

routers(app)
// 监听启动端口
app.listen(kiteConfig.server.port)

console.log(`server is start at port ${kiteConfig.server.port}`)
