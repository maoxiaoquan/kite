/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */


// Important modules this config uses
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {HashedModuleIdsPlugin} = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const optimizeCss = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const config = require('./config')
module.exports = require('./webpack.base.config')({
  mode: 'development',

  // In production, we skip all hot-reloading stuff
  /* entry: [
     require.resolve('react-app-polyfill/ie11'),
     path.resolve(__dirname, '../src/app.js')
   ],*/

  entry: [
    require.resolve('react-app-polyfill/ie11'),
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    path.resolve(__dirname, '../src/app.js')
  ],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    path: config.dev.output.path,
    publicPath: './',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 源模板文件
      inject: true
    }),
    new webpack.HotModuleReplacementPlugin() // Tell webpack we want hot reloading
    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
  ],
  devtool: 'eval-source-map',
  performance: {
    hints: false
  }
})
