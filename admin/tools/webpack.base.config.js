/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: '/'
    },
    options.output
  ), // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { // options.babelQuery
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false
                }
              ],
              '@babel/preset-react'
            ],
            plugins: [
              'styled-components',
              /*[  暂时关闭 开启 入口文件 @babel/polyfill
                '@babel/plugin-transform-runtime',
                {
                  'corejs': false,
                  'helpers': true,
                  'regenerator': true,
                  'useESModules': false
                }
              ],*/
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-decorators', {'legacy': true}], // 启用对实验室语法'decorators-legacy'的支持
              '@babel/plugin-proposal-class-properties',
              ['import', {
                'libraryName': 'antd',
                'libraryDirectory': 'es',
                'style': 'css' // `style: true` 会加载 less 文件
              }]
            ],
            env: {
              production: {
                only: ['app'],
                plugins: [
                  'lodash',
                  'transform-react-remove-prop-types',
                  '@babel/plugin-transform-react-inline-elements',
                  '@babel/plugin-transform-react-constant-elements'
                ]
              },
              test: {
                plugins: [
                  '@babel/plugin-transform-modules-commonjs',
                  'dynamic-import-node'
                ]
              }
            }
          }
        }
      },
      {
        test: /\.less$/,     // 解析less
        exclude: /node_modules/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.scss$/,     // 解析scss
        exclude: /node_modules/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          options.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'font/[name].[hash:4].[ext]'
        }
      },
      {
        test: /\.(jpe?g|png|gif)(\?.*)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    // new webpack.HotModuleReplacementPlugin()
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main']
  },
  devtool: options.devtool,
  stats: {
    // clear min-css warning
    entrypoints: false,
    children: false
  },
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {}
})
