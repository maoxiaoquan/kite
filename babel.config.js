module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    'styled-components',
    /*[  暂时关闭 开启 入口文件 @babel/polyfill
      '@babel/plugin-transform-runtime',
      {
        'corejs': false,
        'helpers': true,
        'regenerator': true,
        'useESModules': false
      }
    ],*/
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', {'legacy': true}], // 启用对实验室语法'decorators-legacy'的支持
    '@babel/plugin-proposal-class-properties',
    ['import', {
      'libraryName': 'antd',
      'libraryDirectory': 'es',
      'style': 'css' // `style: true` 会加载 less 文件
    }]
  ],
  env: {
    production: {
      only: ['app'],
      plugins: [
        'lodash',
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-inline-elements',
        '@babel/plugin-transform-react-constant-elements'
      ]
    },
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        'dynamic-import-node'
      ]
    }
  }
}
