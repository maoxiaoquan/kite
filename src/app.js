import React, { Component } from 'react';
import ReactDOM from 'react-dom'

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
      <div>111111111111</div>
    )
  }
}


ReactDOM.render(
  <Demo />,
  document.getElementById('app')
);
