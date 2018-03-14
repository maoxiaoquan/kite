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

import './header.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends Component {
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
    this.setState({
      current: e.key
    });
  }

  click() {
    console.log(this.props);
  }

  render() {
    const { title } = this.props;
    console.log('title', title)
    return (
      <div className="admin-header" id="admin-header">
        <div className="admin-header-view clearfix">
          <Row>
            <Col
              lg={{ span: 5 }}  /*3 ≥992px 响应式栅格 */
              md={{ span: 6 }}  /*4 ≥768px 响应式栅格 */
              sm={{ span: 24 }}  /*5 ≥576px 响应式栅格 */
              xl={{ span: 5 }}  /*2 ≥1200px 响应式栅格 */
              xs={{ span: 24 }}  /*6 <576px 响应式栅格 */
              xxl={{ span: 4 }} /*1 ≥1600px 响应式栅格 */
            >
              <a id="logo" href="/">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" />
                <img src="https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg" alt="Ant Design" />
              </a>
            </Col>
            <Col
              lg={{ span: 19 }}  /* 3 */
              md={{ span: 18 }}  /* 4 */
              sm={{ span: 0 }}  /* 5 */
              xl={{ span: 19 }}  /* 2 */
              xs={{ span: 0 }}  /* 6 */
              xxl={{ span: 20 }} /* 1 */
            >
              <div id="search-box">
                <i className="anticon anticon-search"></i>
                <input type="text" />
              </div>

              <Menu
                id="nav"
                mode="horizontal"
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
              >
                <Menu.Item key="index">
                  <Link to="/main">
                    <Icon type="mail" />主页
                  </Link>
                </Menu.Item>
                <Menu.Item disabled
                  key="app"
                >
                  <Icon type="appstore" />Navigation Two
              </Menu.Item>
                <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
                  <MenuItemGroup title="Item 1">
                    <Menu.Item key="setting:1">Option 1</Menu.Item>
                    <Menu.Item key="setting:2">Option 2</Menu.Item>
                  </MenuItemGroup>
                  <MenuItemGroup title="Item 2">
                    <Menu.Item key="setting:3">Option 3</Menu.Item>
                    <Menu.Item key="setting:4">Option 4</Menu.Item>
                  </MenuItemGroup>
                </SubMenu>
                <Menu.Item key="alipay">
                  <a href="https://ant.design"
                    rel="noopener noreferrer"
                    target="_blank"
                  >66</a>
                </Menu.Item>
              </Menu>
            </Col>
          </Row>
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
})(Header);
