const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')

const isDebug = process.env.NODE_ENV !== 'production'

module.exports = merge(baseWebpackConfig, {
  mode: isDebug ? 'development' : 'production',
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {   // 抽离第三方插件
          test: /node_modules/,   // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor',  // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        utils: {
          // 抽离自己写的公共代码，utils里面是一个公共类库
          chunks: 'initial',
          name: 'utils',  //  任意命名
          minSize: 0    // 只要超出0字节就生成一个新包
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 源模板文件
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件【注意：这里的根路径是module.exports.output.path】
      chunks: ['vendor', 'index', 'utils'],  //  引入需要的chunk
      inject: true
    })
  ]
})
