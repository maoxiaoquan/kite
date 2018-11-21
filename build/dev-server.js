const browserSync = require('browser-sync');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const proxy = require('http-proxy-middleware');
const config = require('./webpack.dev');
const cfg = require('../config')

process.env.NODE_ENV = 'development'; // 设置为开发环境

const bundler = webpack(config);

// Run Browsersync
browserSync({
  port: cfg.dev_port,
  ui: {
    port: 8089
  },
  server: {
    baseDir: '../src',

    middleware: [
      historyApiFallback(),

      webpackDevMiddleware(bundler, {
        // Dev middleware can't access config, so we provide publicPath
        publicPath: config.output.publicPath,

        // These settings suppress noisy webpack output so only errors are displayed to the console.
        noInfo: false,
        quiet: false,
        hot: true,
        stats: {
          assets: false,
          colors: true,
          version: false,
          hash: false,
          timings: false,
          chunks: false,
          chunkModules: false
        }

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),
      // bundler should be the same as above
      webpackHotMiddleware(bundler),
      proxy({
        target: `http://localhost:${cfg.product_port}/`,
        changeOrigin: true
      })
    ]
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    '../src/*.html'
  ]
});
