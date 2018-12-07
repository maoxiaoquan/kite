const utils = require('./utils')
const webpack = require('webpack')
const config = require('./config')
const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const portfinder = require('portfinder')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDebug = false
const assetsPath = function (_path) {
  return path.posix.join('asset', _path)
}

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  entry: [
    '@babel/polyfill',
    path.resolve(__dirname, '../admin/src/app.js')
  ],
  output: {
    path: path.resolve(__dirname, config.build.assetsRoot),
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js'),
    publicPath: config.build.assetsPublicPath
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  // these devServer options should be customized in /config/index.js
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ],
    nodeEnv: 'production',
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        },
        main: {
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, config.build.assetsRoot)]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../admin/public/index.html'), // 源模板文件
      filename: path.resolve(__dirname, config.build.index), // 输出文件【注意：这里的根路径是module.exports.output.path】
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true
    })
  ]
})
