const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const base = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const {
  admin: {
    srcDir,
    basePath
  },
  theme
} = require('../../../kite.config')
const development = {
  entry: [
    'webpack-hot-middleware/client?path=./__webpack_hmr',
    'react-hot-loader/patch',
    srcDir
  ],
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.less$/, // 解析scss
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
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
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
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
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../public/index.html'), // 源模板文件
      favicon: path.resolve(__dirname, '../../public/favicon.ico'),
      inject: true
    }),
    new IncludeAssetsPlugin({
      assets: [{
        path: 'dll',
        glob: '*.js',
        globPath: path.join(basePath, 'dll')
      }],
      append: false
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(base, development)
