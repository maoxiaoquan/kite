// Important modules this config uses
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {HashedModuleIdsPlugin} = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const optimizeCss = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const config = require('./config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = require('./webpack.base.config')({
  mode: 'production',

  // In production, we skip all hot-reloading stuff
  entry: [
    require.resolve('react-app-polyfill/ie11'),
    path.resolve(__dirname, '../src/app.js')
  ],
  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    path: config.build.output.path,
    publicPath: '/dist/',
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].chunk.js'
  },

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
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },

  plugins: [
    // Minify and optimize the index.html
   /* new BundleAnalyzerPlugin(),*/
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:5].css',
      chunkFilename: 'css/[name].[contenthash:5].css',
      orderWarning: true, // Disable to remove warnings about conflicting order between imports
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 源模板文件
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
    }),
    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new optimizeCss({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      cssProcessorOptions: {
        discardComments: {removeAll: true}
      },
      canPrint: true //是否将插件信息打印到控制台
    }),
    // 优化 moment.js 库的体积，https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin([path.resolve(process.cwd(), 'static/dist')]),
    new HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20
    })
  ],
  performance: {
    assetFilter: assetFilename =>
      !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  }
})
