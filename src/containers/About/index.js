// bundle模型用来异步加载组件
import React from 'react';
import { combineReducers } from 'redux';
import Bundle from '../../Bundle';

// eslint-disable-next-line import/no-webpack-loader-syntax

// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用

export default (props) => {
  if (!window.rootCombineReducer.about) {
    window.rootCombineReducer.about = require('./reducers/index').default;
    const nextReducer = combineReducers(window.rootCombineReducer);
    window.store.replaceReducer(nextReducer);
  }
  return (
    <Bundle load={require('bundle-loader?lazy&name=app-[name]!./view/about.js')}>
      {Component => <Component {...props} />}
    </Bundle>
  );
};
