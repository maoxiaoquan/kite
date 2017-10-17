import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import './app.scss'

class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showloading: false,
      removeloading: false,
    }
  }

  render() {
    return (
      <div className="app">11111455555555666555551111111</div>
    )
  }
}


ReactDOM.render(
  <Demo />,
  document.getElementById('app')
);
