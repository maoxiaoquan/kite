const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const kiteConfig = require('../kite.config')
const routers = require('./routers')
const graphql = require('./graphql')
const { lowdb } = require('../db/lowdb')
const cli = lowdb
  .read()
  .get('cli')
  .value()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
// 配置静态资源加载中间件

app.use(express.static(path.join(__dirname, '../static')))

// 配置服务端模板渲染引擎中间件
app.engine('html', ejs.__express)
app.set('engine', 'ejs')
// 模板的默认存放目录是views，所以在建立文件夹的时候可以命名为views,如果想改的话，可以这样设置
app.set('views', path.join(__dirname, '../views'))

if (cli.is_success) {
  graphql(app)
}
// 加载路由中间件

routers(app)
// 监听启动端口
app.listen(kiteConfig.server.ininProt)

console.log(
  `Initialization mode in progress...... 
port ：${kiteConfig.server.ininProt}`
)
