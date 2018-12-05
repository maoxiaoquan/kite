const config = require('./config')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.config')
const WebpackDevServer = require('webpack-dev-server')

process.env.NODE_ENV = 'development'

// create compiler
const compiler = webpack(webpackConfig)

var server = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  clientLogLevel: 'warning',
  historyApiFallback: true,
  hot: true,
  compress: true,
  host: config.dev.host,
  port: config.dev.port,
  open: config.dev.autoOpenBrowser,
  overlay: config.dev.errorOverlay
    ? {warnings: false, errors: true}
    : false,
  publicPath: config.dev.assetsPublicPath,
  proxy: config.dev.proxyTable,
  quiet: true, // 不输出启动 log
  watchOptions: {
    poll: config.dev.poll
  },
  //代理配置，来源于 http-proxy-middleware
  setup: function (app) {
    //webpack-dev-server 本身是 Express 服务器可以添加自己的路由
    // app.get('/some/path', function(req, res) {
    //   res.json({ custom: 'response' });
    // });
  },
  //为 Express 服务器的 express.static 方法配置参数 http://expressjs.com/en/4x/api.html#express.static
  staticOptions: {},
  //打包状态信息输出配置
  stats: {colors: true}
})

server.listen(config.dev.port, 'localhost', () => {
  console.log('port', config.dev.port)
})

