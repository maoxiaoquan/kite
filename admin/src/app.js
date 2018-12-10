import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerReducer } from 'react-router-redux/lib/reducer'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { AppContainer } from 'react-hot-loader'
import rootReducer from './stores/reducers/index'

import './app.scss'

import App from './routers/router'
/* router 文件 */

const middlewares = [thunk]

const store = createStore(
  combineReducers({routing: routerReducer, ...rootReducer}),
  composeWithDevTools(applyMiddleware(...middlewares))
)

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component/>
      </Provider>
    </AppContainer>,
    document.getElementById('app')
  )

render(App)

if (module.hot) {
  module.hot.accept('./routers/router.js', () => {
    const NextRootContainer = require('./routers/router.js').default
    render(NextRootContainer)
  })
}
