import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  Menu,
  Icon,
  Row,
  Col,
  Avatar,
  Progress,
  Dropdown,
  Input,
  Layout
} from 'antd'
import './header.scss'
import { getAdminIndexStatistics } from '../../containers/Index/actions'
import state_title from '../../stores/reducers/title'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        个人资料
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        退出
      </a>
    </Menu.Item>
  </Menu>
)

@withRouter
@connect(({ state_title, state_mange }) => ({
  state_title,
  state_mange
}))
class Header extends Component {
  state = {
    current: ''
  }

  topMenuClick = e => {
    this.setState({
      current: e.key
    })
  }

  _esc = () => {
    localStorage.box_tokens = ''
    this.props.history.push('/sign_in')
  }

  render() {
    const {
      collapsed,
      onCollapseChange,
      state_mange: { user = {} }
    } = this.props
    return (
      <Layout.Header
        className={{
          'k-header': true,
          collapsed
        }}
      >
        <div className="clearfix">
          <div className="pull-left">
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={() => onCollapseChange(!collapsed)}
            />
          </div>
          <div className="pull-right">
            <Menu
              onClick={this.topMenuClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="alipay" />
              <SubMenu
                title={
                  <span className="personal">
                    <span className="nickname">{user.nickname}</span>
                    <Avatar src={user.avatar} />
                  </span>
                }
              >
                {/* <Menu.Item key="setting:1">个人资料</Menu.Item>*/}
                <Menu.Item key="setting:2" onClick={this._esc}>
                  退出
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        </div>
      </Layout.Header>
    )
  }
}

export default Header
