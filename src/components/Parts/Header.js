import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Row, Col, Progress, Dropdown, Input } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'

const Search = Input.Search
import axios from 'axios'

import './header.scss'

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">个人资料</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">退出</a>
    </Menu.Item>
  </Menu>
)

class Header extends Component {

  render () {
    return (
      <div className="k-header clearfix">
        <div className="pull-right">
          <ul className="clearfix">
            <li className="avatar-view">
              <a className="avatar" href="#">
                <img src="/upload/web/user_avatar/2018/11/1542860078343.PNG" alt=""/>
              </a>
            </li>
            <li className="mess"><i className="iconfont icon-icon-test"></i></li>
            <li className="setting">
              <Dropdown overlay={menu}>
                <i className="iconfont icon-set"></i>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default connect((title) => {
  return {
    title
  }
})(Header)
