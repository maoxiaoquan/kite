import React from 'react';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

const middleware = [thunk]; // redux-thunk解决异步回调

if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

function configureStore(initState) {
  const finalCreateStore = compose(applyMiddleware(...middleware))(createStore);
  const store = finalCreateStore(rootReducer, initState);
  return store;
}

export default configureStore;
