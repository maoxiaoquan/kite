const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const CssNaNo = require('cssnano')
const PostCssPresetEnv = require('postcss-preset-env')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const base = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const {
  admin: { basePath, srcDir, outDir },
  theme
} = require('../../../kite.config')

const production = {
  entry: [srcDir],
  output: {
    filename: 'js/[name].[chunkhash:5].js'
  },
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.less$/, // 解析scss
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                PostCssPresetEnv({
                  browsers: ['> 1%', 'last 5 version', 'ie > 8']
                }),
                CssNaNo({
                  reduceIdents: false,
                  autoprefixer: false
                })
              ]
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              paths: [srcDir],
              modifyVars: theme
            }
          }
        ]
      },
      {
        test: /\.scss$/, // 解析scss
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                PostCssPresetEnv({
                  browsers: ['> 1%', 'last 5 version', 'ie > 8']
                }),
                CssNaNo({
                  reduceIdents: false,
                  autoprefixer: false
                })
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              javascriptEnabled: true,
              paths: [srcDir],
              modifyVars: theme
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          }
        ]
      }
    ]
  },
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
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:5].css',
      chunkFilename: 'css/[name].[contenthash:5].css',
      orderWarning: true // Disable to remove warnings about conflicting order between imports
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'), // 源模板文件
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
      favicon: path.resolve(__dirname, '../../public/favicon.ico')
    }),
    new IncludeAssetsPlugin({
      assets: [
        {
          path: 'dll',
          glob: '*.js',
          globPath: path.join(basePath, 'dll')
        }
      ],
      append: false
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(basePath, 'dll'),
        to: path.join(outDir, 'dll')
      }
    ])
  ]
}

module.exports = merge(base, production)
