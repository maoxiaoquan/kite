const webpack = require('webpack')
const path = require('path')
const config = require('../../../kite.config')

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
      'redbox-react'
    ]
  },
  mode: 'production',
  output: {
    path: path.resolve(config.admin.basePath, 'dll'),
    filename: '[name].dll.[hash:5].js',
    library: '[name]_library'
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(config.admin.basePath, 'dll', 'manifest.json'),
      context: config.admin.basePath
    })
  ]
}
