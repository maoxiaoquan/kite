import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Row, Col } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import axios from 'axios';

import './sign.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Sign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      one: '刷5558新',
      current: 'mail'
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

  handleClick = (e) => {
    console.log('click ', e);
  }

  click() {
    console.log(this.props);
  }

  render() {
    const { title } = this.props;
    console.log('title', title)
    return (
      <div className="sign" id="admin-sign">
        dasd
      </div>
    );
  }
}

export default connect((title) => {
  console.log('title', title.title.title);
  return {
    title
  };
})(Sign);
