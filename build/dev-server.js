const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const dev_config = require('./webpack.dev.js');
const path = require('path');

process.env.NODE_ENV = 'development'//设置为开发环境

const dev_server = new WebpackDevServer(webpack(dev_config), {
  contentBase: path.resolve(__dirname, '../dist/'),//默认webpack-dev-server会为根文件夹提供本地服务器
  inline: true,//设置为true，当源文件改变时会自动刷新页面
  historyApiFallback: true,
  stats: {
    colors: true,
  },
})

console.log('开发模式...')
console.log('端口号:8080')

dev_server.listen(8080)

