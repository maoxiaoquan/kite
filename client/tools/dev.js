const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const chalk = require('chalk')
const LRU = require('lru-cache')
const setupDevServer = require('../tools/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')
const config = require('../../kite.config')
const fs = require('fs')
const router = express.Router()
app.use(cookieParser())
// 缓存
const microCache = new LRU({
  max: 100,
  maxAge: 1000 * 60 // 重要提示：条目在 1 秒后过期。
})

const cacheable_list = [
  // 添加缓存页面
  '/test'
]

const isCacheable = (req, res, next) => {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定(non-user-specific)页面才会缓存
  console.log(req.url)
  if (~cacheable_list.indexOf(req.url)) {
    return true
  }
  return false
}

const proxy = require('http-proxy-middleware')

// 配置静态资源加载中间件

app.use(express.static(path.join(__dirname, '../../static')))

app.use((req, res, next) => {
  // 接口进行拦截，并进行代理
  if (req.url.startsWith('/api-client/v1') || req.url.startsWith('/graphql')) {
    req.respond = false
    return proxy(config.client.proxy)(req, res, next)
  }
  return next()
})

let renderer
const templatePath = path.resolve(__dirname, '../public/index.template.html')

setupDevServer(app, templatePath, (bundle, options) => {
  console.log('bundle success ~~~~~~')
  const option = Object.assign(
    {
      runInNewContext: false
    },
    options
  )
  renderer = createBundleRenderer(bundle, option)
})

const render = async (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  let accessToken = req.cookies.accessToken || ''
  const handleError = async err => {
    if (err.code === 404) {
      const html = fs.readFileSync(
        path.resolve(__dirname, '../../views/404.html'),
        'utf-8'
      )
      res.status(404)
      res.send(html)
    } else {
      res.status(500)
      res.send('500 Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    url: req.url,
    accessToken: accessToken
  }

  // 判断是否可缓存，可缓存并且缓存中有则直接返回
  const cacheable = isCacheable(req, res, next)
  if (cacheable) {
    const hit = microCache.get(req.url)
    if (hit) {
      console.log('从缓存中取', hit)
      res.send(hit)
    }
  }

  try {
    const html = await renderer.renderToString(context)
    res.send(html)
    if (cacheable) {
      console.log('设置缓存: ', req.url)
      microCache.set(req.url, html)
    }
  } catch (error) {
    handleError(error)
  }
}

router.get('*', render)

app.use('/', router)

const port = config.client.port

app.listen(port, () => {
  console.log(chalk.green(`server started at localhost:${port}`))
})
