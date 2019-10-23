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
      'request-config': '../request/requestClient.js'
    }
  },
  devtool: false,
  plugins: [
    // webpack4.0版本以上采用MiniCssExtractPlugin 而不使用extract-text-webpack-plugin
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    //  当vendor模块不再改变时, 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    splitChunks: {
      // async表示只从异步加载得模块（动态加载import()）里面进行拆分
      // initial表示只从入口模块进行拆分
      // all表示以上两者都包括
      chunks: 'all',
      minSize: 30000, // 大于30k会被webpack进行拆包
      minChunks: 1, // 被引用次数大于等于这个次数进行拆分
      // import()文件本身算一个
      // 只计算js，不算css
      // 如果同时有两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
      maxAsyncRequests: 5, // 最大的按需加载（异步）请求次数
      // 最大的初始化加载请求次数,为了对请求数做限制，不至于拆分出来过多模块
      // 入口文件算一个
      // 如果这个模块有异步加载的不算
      // 只算js，不算css
      // 通过runtimeChunk拆分出来的runtime不算在内
      // 如果同时又两个模块满足cacheGroup的规则要进行拆分，但是maxInitialRequests的值只能允许再拆分一个模块，那尺寸更大的模块会被拆分出来
      maxInitialRequests: 3,
      automaticNameDelimiter: '~', // 打包分隔符
      name: true,
      cacheGroups: {
        // 默认的配置
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        // 默认的配置，vendors规则不命中的话，就会命中这里
        default: {
          minChunks: 2, // 引用超过两次的模块 -> default
          priority: -20,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
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
