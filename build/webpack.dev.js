const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* 此配置是开发模式下的调试配置 */

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    app: path.resolve(__dirname, "../src/app.js")
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "../dist")
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader'//loader的名称（必须）
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
    new webpack.HotModuleReplacementPlugin()//热模块替换插件
  ],
  resolve: {
    extensions: ['.js', '.json', '.scss']
  }
}

