const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseWebpackConfig = require('./webpack.base.conf')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const config = require('./config')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  entry: path.join(__dirname, '../src/entry-server.js'),
  output: {
    path: process.env.NODE_ENV === 'production' ? config.server.assetsRoot : config.dev.assetsRoot,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      // 将css样式单独提取出文件
      extract: false, // 使用 vue-style-loader 处理css
      usePostCSS: true
    })
  },
  resolve: {
    alias: {
      'request-config': '../request/request_server.js',
    }
  },
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"server"'
    }),
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueServerPlugin()
  ]
})
