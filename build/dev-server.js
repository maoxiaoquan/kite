process.env.NODE_ENV = 'development'//设置为开发环境

const webpack = require('webpack');
const express = require('express');
const config = require('./webpack.dev.js');
const proxyMiddleware = require('http-proxy-middleware')
const path = require('path');
const app = express();
const compiler = webpack(config);


app.use('/', require('connect-history-api-fallback')()); // Add  
app.use('/', express.static('../dist'));

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  inline: true,
  progress: true,
  stats: {
    colors: true,
  }
}));

//代理服务器
/* app.use('/shopro', proxyMiddleware({
    target: 'http://cangdu.org',
    changeOrigin: true,
})) */

app.use(require('webpack-hot-middleware')(compiler));

app.listen(8080, function () {
  console.log('http://localhost:8080');
});