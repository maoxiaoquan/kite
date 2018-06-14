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
    return (
      <div className="admin-aside box-card" id="admin-aside">
        <div className="box-card-header">
          <h2><strong>VACUO</strong> 主列表</h2>
          {/*<ul className="header-dropdown">
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
          </ul>*/}
        </div>

        <div className="admin-aside-view clearfix">

          <Menu
            mode="inline"
            defaultOpenKeys={['12','2']}
            onClick={this.handleClick}
          >
            <Menu.Item key="1">
              <Link to="/master/index/main">
                <Icon type="pie-chart"/>
                <span>主页</span>
              </Link>
            </Menu.Item>
            <SubMenu key="12" title={<span><Icon type="setting"/><span>网站管理</span></span>}>
              <Menu.Item key="8"> <Link to="/master/index/User">用户管理</Link></Menu.Item>
              <Menu.Item key="9">文章管理</Menu.Item>
              <Menu.Item key="10">分类管理</Menu.Item>
              <Menu.Item key="11">标签管理</Menu.Item>
            </SubMenu>
            <SubMenu key="2" title={<span><Icon type="setting"/><span>系统管理</span></span>}>
              <Menu.Item key="3"> <Link to="/master/index/adminUser">管理员管理</Link></Menu.Item>
              <Menu.Item key="4"><Link to="/master/index/adminRole">角色管理</Link></Menu.Item>
              <Menu.Item key="5"><Link to="/master/index/adminAuthority">权限菜单</Link></Menu.Item>
              <Menu.Item key="6">数据备份</Menu.Item>
              <Menu.Item key="7">系统日志</Menu.Item>
            </SubMenu>
          </Menu>


        </div>
      </div>
    )
  }
}

export default connect((title) => {
  return {
    title
  }
})(Aside)
