const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../../kite.config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  entry: {
    app: path.join(__dirname, '../src/entryClient.js')
  },
  output: {
    path: config.client.assetsRoot,
    filename: '[name].js'
  },
  module: {
    // 使用 vue-style-loader 处理css
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'request-config': '../request/requestClient.js',
      'fetch-config': '../fetch/requestClient.js'
    }
  },
  devtool: config.client.devtool, //  cheap-module-eval-source-map编译更快
  plugins: [
    // 热加载必备
    new webpack.HotModuleReplacementPlugin(),
    // 友好错误提示
    new FriendlyErrorsPlugin({
      onErrors: config.client.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
    })
  ]
})

module.exports = devWebpackConfig
