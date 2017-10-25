// bundle模型用来异步加载组件
import React from 'react';
import { combineReducers } from 'redux'
import Bundle from '../../Bundle';


// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用

import ListView from 'bundle-loader?lazy&name=app-[name]!../../views/List/list.js';

export const List = () => {
  if (!window.rootCombineReducer.list) {
    window.rootCombineReducer.list = require('./reducers').default
    const nextReducer = combineReducers(window.rootCombineReducer)
    window.store.replaceReducer(nextReducer)
  }

  return (
    <Bundle load={ListView}>
      {(List) => <List />}
    </Bundle>
  )
}


if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    window.rootCombineReducer.list = require('./reducers').default
    const nextReducer = combineReducers(window.rootCombineReducer)
    window.store.replaceReducer(nextReducer)
  })
}


