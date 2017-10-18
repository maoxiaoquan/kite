import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import Demo from './Demo'

ReactDOM.render(
  <Demo />,
  document.getElementById('app')
);


if (module.hot) {  
  module.hot.accept();
}

if (module.hot) {
  var hotEmitter = require("webpack/hot/emitter");
  hotEmitter.on("webpackHotUpdate", function (currentHash) {
    document.querySelectorAll('link[href][rel=stylesheet]').forEach((link) => {
      const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`)
      link.href = nextStyleHref
    })
  })
}
