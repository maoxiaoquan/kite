import React from 'react';
import { combineReducers ,createStore,applyMiddleware} from 'redux'
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

window.rootCombineReducer = {}

const middleware = [thunk] // redux-thunk解决异步回调

if (process.env.NODE_ENV != 'production') {
 middleware.push(createLogger())
}

window.rootCombineReducer.index = require('./reducers').default
const nextReducer = combineReducers(window.rootCombineReducer)

export const store = window.store = createStore(nextReducer,
  applyMiddleware(...middleware) // 中间件
)
 
if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      window.rootCombineReducer.index = require('./reducers').default
      const nextReducer = combineReducers(window.rootCombineReducer)
      window.store.replaceReducer(nextReducer)
    });
}


