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
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
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
