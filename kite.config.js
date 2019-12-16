// 此文件是 kite 的总配置文件
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_NODE_ENV = process.env.NODE_ENV === 'development'

function ProcessCwd (val) {
  return path.resolve(process.cwd(), val)
}

module.exports = {
  version: 0.8,
  theme: {
    'font-family': 'Microsoft YaHei'
  },
  env: NODE_ENV,
  publicStatic: ProcessCwd('static'),
  client: {
    port: 8081, // 前台调试端口号
    assetsSubDirectory: 'static',
    proxy: {
      target: `http://localhost:8086`, // client ssr
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/client': '/client',
        '^/graphql': '/graphql'
      }
    },
    assetsRoot: IS_NODE_ENV
      ? ProcessCwd('client/_client')
      : ProcessCwd('static/_client'),
    publicPath: IS_NODE_ENV ? '/' : '/_client/',
    devtool: IS_NODE_ENV ? 'cheap-module-eval-source-map' : '#source-map',
    dev: {
      notifyOnErrors: true,
      useEslint: true,
      showEslintErrorsInOverlay: false,
      cssSourceMap: true
    }
  },
  admin: {
    // admin spa
    port: 8083, // 后台调试端口号
    basePath: ProcessCwd('admin'),
    srcDir: ProcessCwd('admin/src'),
    outDir: IS_NODE_ENV
      ? ProcessCwd('admin/_admin')
      : ProcessCwd('static/_admin'),
    publicPath: IS_NODE_ENV ? './' : '/_admin/',
    proxy: {
      '/api-admin/v1': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      },
      '/default': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      },
      '/upload': {
        target: `http://localhost:8086/`,
        secure: false,
        changeOrigin: true
      }
    }
  },
  server: {
    // server
    default_avatar: '/default/img/avatar.jpeg', // 所有使用的默认头像
    port: 8099, // 生产环境运行端口号
    ininProt: 8085 // 初始化项目端口号
  }
}
