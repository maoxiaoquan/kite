const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //css单独打包
const HtmlWebpackPlugin = require('html-webpack-plugin');


const APP_PATH = path.resolve(__dirname, "../src")

process.env.NODE_ENV = 'production'//设置为生产环境
/* 此配置是生产环境下的极质打包模式 */

module.exports = {
  entry: {
    app: path.resolve(__dirname, "../src/app.js")
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: '[name].js', //编译后的文件名字
    chunkFilename: '[name].[chunkhash:5].min.js',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader',//loader的名称（必须）
        include: [APP_PATH]
      },
      {
        test: /\.css$/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'autoprefixer-loader']),
        include: [APP_PATH]
      },
      {
        test: /\.less$/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'autoprefixer-loader', 'less-loader']),
        include: [APP_PATH]
      },
      {
        test: /\.scss$/,
        exclude: /^node_modules$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'autoprefixer-loader', 'sass-loader']),
        include: [APP_PATH]
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        loader: 'file-loader?name=[name].[ext]',
        include: [APP_PATH]
      },
      {
        test: /\.(png|jpg)$/,
        exclude: /^node_modules$/,
        loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
        //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
        include: [APP_PATH]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html'), // 源模板文件
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件【注意：这里的根路径是module.exports.output.path】
      showErrors: true,
      inject: 'body',
    }),
    new ExtractTextPlugin("[name].[hash].css"),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.scss', '.css'] //后缀名自动补全
  }
}

