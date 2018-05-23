import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Row, Col, Progress } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import axios from 'axios'

import './aside.scss'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class Aside extends Component {
  constructor (props) {
    super(props)
    this.state = {
      one: '刷5558新',
      current: 'mail'
    }
  }

  componentWillMount () {

  }

  handleClick = (e) => {
    console.log('click ', e)
  }

  click () {
    console.log(this.props)
  }

  render () {
    const {title} = this.props
    console.log('title', title)
    return (
      <div className="admin-aside box-card" id="admin-aside">
        <div className="box-card-header">
          <h2><strong>VACUO</strong> 主列表</h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
            <li className="remove">
              <a className="boxs-close" role="button">
                <Icon type="close"/>
              </a>
            </li>
          </ul>
        </div>

        <div className="admin-aside-view clearfix">

          <Menu
            defaultSelectedKeys={['g1']}
            mode="inline"
            onClick={this.handleClick}
          >
            <Menu.Item key="1">
              <Link to="/master/index/main">
                <Icon type="pie-chart"/>
                <span>主页</span>
              </Link>
            </Menu.Item>
            <SubMenu key="sub1" title={<span><Icon type="setting"/><span>系统管理</span></span>}>
              <MenuItemGroup key="g1" title="权限管理">
                <Menu.Item key="3"> <Link to="/master/index/adminUser">管理员管理</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/master/index/adminRole">角色管理</Link></Menu.Item>
                <Menu.Item key="5">权限菜单</Menu.Item>
              </MenuItemGroup>
              <MenuItemGroup key="g2" title="CMS系统">
                <Menu.Item key="6">数据备份</Menu.Item>
                <Menu.Item key="7">系统日志</Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="setting"/><span>Navigation Three</span></span>}>
              <Menu.Item key="8">Option 9</Menu.Item>
              <Menu.Item key="9">Option 10</Menu.Item>
              <Menu.Item key="10">Option 11</Menu.Item>
              <Menu.Item key="11">Option 12</Menu.Item>
            </SubMenu>
          </Menu>


        </div>
      </div>
    )
  }
}

export default connect((title) => {
  console.log('title', title.title.title)
  return {
    title
  }
})(Aside)
