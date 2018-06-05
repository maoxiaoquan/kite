import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import axios from 'axios';

import './list.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '刷5558新'
    };
  }

  componentWillMount() {
  }

  click() {
    console.log(this.props);
  }

  render() {
    const { title } = this.props;
    return (
      <div className="list">
        <div>
          22999{this.state.one}
        </div>
        <p>
          {title.title.title}
          <Button>1161</Button>
        </p>
        <div className="img-bg">
          111
        </div>
      </div>
    );
  }
}

export default connect((title) => {
  return {
    title
  };
})(List);
