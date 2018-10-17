const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // css单独打包
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressbarWebpack = require('progress-bar-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const APP_PATH = path.resolve(__dirname, '../src')

process.env.NODE_ENV = 'production' // 设置为生产环境
/* 此配置是生产环境下的极质打包模式 */

console.log('极质打包进行中......')

const assetsPath = function (_path) {
  return path.posix.join('static', _path)
}

module.exports = {
  entry: {
    // 文件入口配置
    index: path.resolve(__dirname, '../src/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'redux'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/', // 编译好的文件，在服务器的路径,域名会自动添加到前面  
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js')
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
            plugins: [
              ['import', {libraryName: 'antd', style: 'css'}]
            ]
          }
        }, // loader的名称（必须）
        include: [APP_PATH]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader']
        })
      },
      {
        test: /\.less$/,
        exclude: /^node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader', 'less-loader']
        }),
        include: [APP_PATH]
      },
      {
        test: /\.scss$/,
        exclude: /^node_modules$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'autoprefixer-loader', 'sass-loader'],
        }),
        include: [APP_PATH]
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        use: 'file-loader?name=[name].[ext]',
        include: [APP_PATH]
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /^node_modules$/,
        use: 'url-loader?limit=8192&name=static/img/[hash:8].[name].[ext]',
        // 注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
        include: [APP_PATH]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 源模板文件
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件【注意：这里的根路径是module.exports.output.path】
      showErrors: true,
      inject: 'body',
      hash: true,
      // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
      // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更
      minify: {
        // 压缩HTML文件
        removeComments: true,
        // 移除HTML中的注释
        collapseWhitespace: true
        // 删除空白符与换行符
      }
    }),
    new ExtractTextPlugin('static/css/[name].[hash].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true
        }
      },
      sourceMap: false,
      parallel: true
    }),
    new CleanWebpackPlugin(
      ['dist/static/css/*.css', 'dist/static/js/*.js'], // 匹配删除的文件
      {
        root: path.resolve(__dirname, '../'),
        verbose: true, // 开启在控制台输出信息
        dry: false // 启用删除文件
      }
    ),
    new ProgressbarWebpack()
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'] // 后缀名自动补全
  }
}

