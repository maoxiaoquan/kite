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

import './aside.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Aside extends Component {
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
      <div className="admin-aside" id="admin-aside">
        <div className="admin-aside-view clearfix">
          <h2 className="title-h2">Vacuo 主列表</h2>
          <Menu
            defaultOpenKeys={['sub1']}
            defaultSelectedKeys={['1']}
            mode="inline"
            onClick={this.handleClick}
            style={{ width: 256 }}
          >
            <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
              <MenuItemGroup key="g1" title="Item 1">
                <Menu.Item key="1">Option 1</Menu.Item>
                <Menu.Item key="2">Option 2</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup key="g2" title="Item 2">
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
              <Menu.Item key="5">Option 5</Menu.Item>
              <Menu.Item key="6">Option 6</Menu.Item>
              <SubMenu key="sub3" title="Submenu">
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }
}

export default connect((title) => {
  console.log('title', title.title.title);
  return {
    title
  };
})(Aside);
