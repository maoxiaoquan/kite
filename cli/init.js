const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const bodyParser = require('body-parser')
const kiteConfig = require('../kite.config')
const routers = require('./routers/init')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
// 配置静态资源加载中间件
app.use(express.static(path.join(__dirname, '../static')))

// 模板的默认存放目录是views，所以在建立文件夹的时候可以命名为views,如果想改的话，可以这样设置
app.set('views', path.join(__dirname, '../views'))
// 配置服务端模板渲染引擎中间件
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

routers(app)
// 监听启动端口
app.listen(kiteConfig.server.ininProt)

console.log(
  `Initialization mode in progress...... 
port ：${kiteConfig.server.ininProt}`
)
