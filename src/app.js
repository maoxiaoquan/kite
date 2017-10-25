import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import { combineReducers } from 'redux'
import thunk from 'redux-thunk';
import 'antd/dist/antd.css'
import './app.scss'
import App from './routers/router'/* router 文件 */
import reducer from './reducers/index'

const middleware = [thunk] // redux-thunk解决异步回调

if (process.env.NODE_ENV != 'production') {
  middleware.push(createLogger())
}

window.rootCombineReducer = {}

window.rootCombineReducer.index = require('./reducers').default
const indexReducer = combineReducers(window.rootCombineReducer)

const store = window.store = createStore(indexReducer,
  applyMiddleware(...middleware) // 中间件
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

if (process.env.NODE_ENV != 'production') {
  if (module.hot) {
    module.hot.accept();
  }
}


