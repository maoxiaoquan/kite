const path = require('path')
const webpack = require('webpack')
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
    rules: [
      {
        // 此处打包时是有点却别的，因为seo 支持对内容seo, 所
        // 以这里我和一般的vue ssr 处理的不一样，直接全部略过了生成的所有样式
        test: /\.(sa|sc|c)ss$/,
        use: ['ignore-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'request-config': '../request/requestServer.js',
      'fetch-config': '../fetch/requestServer.js'
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
