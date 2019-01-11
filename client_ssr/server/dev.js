const Koa = require('koa')
const path = require('path')
const chalk = require('chalk')
const LRU = require('lru-cache')
const Router = require('koa-router')
const setupDevServer = require('../build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')
const ports = require('../../config/ports')
const koaStatic = require('koa-static')
// 缓存
const microCache = new LRU({
  max: 100,
  maxAge: 1000 * 60 // 重要提示：条目在 1 秒后过期。
})

const cacheable_list = [ // 添加缓存页面
  '/b'
]

const isCacheable = ctx => {
  // 实现逻辑为，检查请求是否是用户特定(user-specific)。
  // 只有非用户特定(non-user-specific)页面才会缓存
  console.log(ctx.url)
  if (~cacheable_list.indexOf(ctx.url)) {
    return true
  }
  return false
}

//  第 1 步：创建koa、koa-router 实例
const app = new Koa()
const router = new Router()

const proxy = require('http-proxy-middleware')

app.use(async (ctx, next) => { // 接口进行拦截，并进行代理
  if (ctx.url.startsWith('/client')) {
    ctx.respond = false
    return proxy({
      target: `http://localhost:${ports.product}`, // 服务器地址
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/client': '/client'
      }
    })(ctx.req, ctx.res, next)
  }
  return next()
})

let renderer
const templatePath = path.resolve(__dirname, './index.template.html')

setupDevServer(app, templatePath, (bundle, options) => {
  console.log('bundle success ~~~~~~')
  const option = Object.assign({
    runInNewContext: false
  }, options)
  renderer = createBundleRenderer(bundle, option)
})

const render = async (ctx, next) => {
  ctx.set('Content-Type', 'text/html')
  let accessToken = ctx.cookies.get('accessToken')
  const handleError = err => {
    if (err.code === 404) {
      ctx.status = 404
      ctx.body = '404 Page Not Found'
    } else {
      ctx.status = 500
      ctx.body = '500 Internal Server Error'
      console.error(`error during render : ${ctx.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    url: ctx.url,
    accessToken: accessToken
  }

  // 判断是否可缓存，可缓存并且缓存中有则直接返回
  const cacheable = isCacheable(ctx)
  if (cacheable) {
    const hit = microCache.get(ctx.url)
    if (hit) {
      console.log('从缓存中取', hit)
      return ctx.body = hit
    }
  }

  try {
    const html = await renderer.renderToString(context)
    ctx.body = html
    if (cacheable) {
      console.log('设置缓存: ', ctx.url)
      microCache.set(ctx.url, html)
    }
  } catch (error) {
    handleError(error)
  }
}

// 配置静态资源加载中间件
app.use(koaStatic(path.join(__dirname, '../../static')))

router.get('*', render)

app
  .use(router.routes())
  .use(router.allowedMethods())

const port = ports.client_dev

app.listen(port, () => {
  console.log(chalk.green(`server started at localhost:${port}`))
})
