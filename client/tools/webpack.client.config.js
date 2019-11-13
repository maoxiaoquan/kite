const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../../kite.config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const pordWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: config.client.assetsRoot,
    // chunkhash是根据内容生成的hash, 易于缓存
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'request-config': '../request/requestClient.js',
      'fetch-config': '../fetch/requestClient.js'
    }
  },
  devtool: false,
  plugins: [
    // webpack4.0版本以上采用MiniCssExtractPlugin 而不使用extract-text-webpack-plugin
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    //  当vendor模块不再改变时, 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin()
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /node_modules/,
          name: 'vendor',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100
        },
        common: {
          chunks: 'all',
          test: /[\\/]src[\\/]js[\\/]/,
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 60
        },
        runtimeChunk: {
          name: 'manifest'
        }
      }
    }
  }
})

if (process.env.NODE_ENV === 'production') {
  pordWebpackConfig.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      minify: false,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = pordWebpackConfig
