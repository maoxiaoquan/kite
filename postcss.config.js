module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {},
    'autoprefixer': {
      'overrideBrowserslist': [
        'last 1 version',
        '> 1%',
        'maintained node versions',
        'not dead'
      ]
    }
  }
}
