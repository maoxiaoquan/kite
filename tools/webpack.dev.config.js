const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')

module.exports = merge(baseWebpackConfig, {
  mode: isDebug ? 'development' : 'production',
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../public/index.html',
      template: 'index.html',
      inject: true
    })
  ]
})


