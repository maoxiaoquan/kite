const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/app.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, "../dist")
  },
}
