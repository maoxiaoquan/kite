import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';
import axios from 'axios';

import './list.scss';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '刷85新',
    };
  }

  componentWillMount() {
    axios.get('/api/v1/topics')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  click() {
    console.log(this.props);
  }

  render() {
    const { title } = this.props;
    console.log('title', title)
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
  console.log('title', title.title.title);
  return {
    title,
  };
})(List);
