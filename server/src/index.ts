import { Express } from 'express'
// import { Express, Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import bodyParser from 'body-parser'

const express = require('express');
const app: Express = express();
const kiteConfig = require('../../kite.config')
import routers from './routers'
const graphql = require('./graphql')
const lowdb = require('../../db/lowdb')
const cli = lowdb
  .read()
  .get('cli')
  .value()

require('../../db/mysqldb/pool').poolInit()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser('cookie_kite'))
// 配置静态资源加载中间件
app.use(express.static(path.join(__dirname, '../../static')))


if (cli.is_success) {
  graphql(app)
}
// 加载路由中间件

routers(app)
// 监听启动端口
app.listen(kiteConfig.server.port)

console.log(`server is start at port ${kiteConfig.server.port}`)
