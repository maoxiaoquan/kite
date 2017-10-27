/* eslint-disable react/no-render-return-value */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

import './app.scss';
import App from './routers/router';/* router 文件 */
import configureStore from './stores/index';

/* eslint-disable no-multi-assign */
const store = window.store = configureStore();

const render = Component =>
  ReactDOM.render(
    <AppContainer >
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );

render(App);

if (module.hot) {
  module.hot.accept('./routers/router.js', () => {
    const NextRootContainer = require('./routers/router.js').default;
    render(NextRootContainer);
  });
}
