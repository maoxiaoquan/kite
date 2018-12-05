const path = require('path')
const DIST_PATH = path.resolve(__dirname, 'dist')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const utils = require('./utils')
const APP_PATH = path.resolve(__dirname, '../src')
const isDebug = process.env.NODE_ENV !== 'production'
const config = require('./config')

const assetsPath = function (_path) {
  return path.posix.join('asset', _path)
}

module.exports = {
  // entry: path.resolve(__dirname, 'src', 'index.js'),
  // output: {
  //     path: DIST_PATH,
  //     publicPath: "",
  //     chunkFilename: "[name].js",
  //     filename: "[name].js"
  // },
  entry: {
    client: ['@babel/polyfill', path.resolve(__dirname, '../src/app.js')]
  },
  output: {
    path: path.resolve(__dirname, config.build.assetsRoot),
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js'),
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  externals: {//引入三方包
    'testPlugin': 'testPlugin'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-stage-2',
              // Flow
              // https://github.com/babel/babel/tree/master/packages/babel-preset-flow
              '@babel/preset-flow',
              // JSX
              // https://github.com/babel/babel/tree/master/packages/babel-preset-react
              '@babel/preset-react'
            ]
          }
        },
        include: __dirname + 'src',          // 只转化src目录下的js
        exclude: __dirname + 'node_modules' // 排除掉node_modules，优化打包速度
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: utils.assetsPath('img/[name].[ext]'),
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },
      {
        test: /\.less$/,     // 解析less
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9' // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009'
                  })
                ]
              }
            },
            'less-loader'
          ] // 从右向左解析
        })
      },
      {
        test: /\.scss$/,     // 解析scss
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9' // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009'
                  })
                ]
              }
            },
            'sass-loader'
          ] // 从右向左解析
        })
      },
      {
        test: /\.css$/,     // 解析css
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: ['css-loader']
        })
      }
    ]
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin()
    new CleanWebpackPlugin(['../dist'])
    /*new copyWebpackPlugin([{//复制static到dist
      from: __dirname + '../src/static',//打包的静态资源目录地址
      to: './static' //打包到dist下面的static
    }])*/
  ]
}
