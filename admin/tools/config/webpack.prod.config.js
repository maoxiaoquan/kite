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
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
          enforce: true
        }
      }
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
