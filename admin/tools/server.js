const express = require('express')
const webpack = require('webpack')
const opn = require('opn')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compress = require('compression')
const proxy = require('http-proxy-middleware')
const webpackConfig = require('./config/webpack.dev.config')
const KiteConfig = require('../../kite.config')
const app = express()
const port = KiteConfig.admin.port
const compiler = webpack(webpackConfig)

app.use(compress())

const devMiddleware = webpackDevMiddleware(compiler, {
  quiet: false,
  noInfo: false,
  lazy: false,
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: 'errors-only'
})

devMiddleware.waitUntilValid(() => {
  opn('http://localhost:' + port)
})

const hotMiddleware = webpackHotMiddleware(compiler, {
  path: '/__webpack_hmr',
  log: false
})

for (let x in KiteConfig.admin.proxy) {
  app.use(proxy(x, KiteConfig.admin.proxy[x]))
}

app.use(devMiddleware)
app.use(hotMiddleware)
app.use(express.static(KiteConfig.admin.basePath))

app.listen(port, () => {
})
