const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')

const config = require('../../config')
const webpack_option = require('./webpack.dev')

new WebpackDevServer(webpack(webpack_option), {
  contentBase: path.join(__dirname, '../dist'),
  hot: true,
  historyApiFallback: true,
  // It suppress error shown in console, so it has to be set to false.
  quiet: false,
  // It suppress everything except error, so it has to be set to false as well
  // to see success build.
  noInfo: false,
  stats: {
    // Config for minimal console.log mess.
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
  proxy: {
    '/': {
      target: `http://localhost:${config.port.product}/`,
    },
  },
}).listen(config.port.admin_dev, 'localhost', (err) => {
  console.log(`Listening at localhost:${config.port.admin_dev}`)
  if (err) {
    console.log(err)
  }
})
