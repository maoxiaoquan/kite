import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';

import './app.scss'
import App from './routers/router'/* router 文件 */
import { store } from './stores/index'


const render = Component =>
  ReactDOM.render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('app')
  )

render(App)

if (module.hot) {
  module.hot.accept('./routers/router', () => {
    const NextRootContainer = require('./routers/router').default
    render(NextRootContainer)
  })
}


