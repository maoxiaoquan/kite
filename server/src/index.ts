import { Express } from 'express'
// import { Express, Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import bodyParser from 'body-parser'
const express = require('express')
const kiteConfig = require('../../kite.config')
import routers from './routers'
import socketLink from './socket/index'
import chat from './socket/chat'
import helmet from 'helmet'
const graphql = require('./graphql')
const lowdb = require('../../db/lowdb')
const app: Express = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {})
require('../../db/mysqldb/pool').poolInit()
app.use(helmet());
const cli = lowdb
  .read()
  .get('cli')
  .value()

io.on('connection', (socket: any) => {
  socketLink(io, socket)
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser('cookie_kite'))
app.use('/api-client/v1', chat(io))
// 配置静态资源加载中间件
app.use(express.static(path.join(__dirname, '../../static')))
app.set('views', path.join(__dirname, '../../views'))
// 配置服务端模板渲染引擎中间件
app.engine('html', require('ejs').renderFile)
if (cli.is_success) graphql(app)
// 加载路由中间件
routers(app)
// 监听启动端口
// app.listen(kiteConfig.server.port)
server.listen(kiteConfig.server.port, () => {
  console.log(`server is start at port ${kiteConfig.server.port}`)
})
