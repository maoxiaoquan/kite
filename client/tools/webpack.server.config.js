const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseWebpackConfig = require('./webpack.base.config')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const config = require('../../kite.config')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  entry: path.join(__dirname, '../src/entryServer.js'),
  output: {
    path: config.client.assetsRoot,
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: false,
      // 将css样式单独提取出文件
      extract: false, // 使用 vue-style-loader 处理css
      usePostCSS: true
    })
  },
  resolve: {
    alias: {
      'request-config': '../request/requestServer.js'
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
