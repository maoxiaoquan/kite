import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Row, Col } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import axios from 'axios'

import './header.scss'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class Header extends Component {
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
    this.setState({
      current: e.key
    })
  }

  click () {
    console.log(this.props)
  }

  render () {
    const {title} = this.props
    return (
      <div className="admin-header"
           id="admin-header"
      >
        <div className="admin-header-view clearfix">

          <Row>
            <Col
              lg={{span: 12}}  /*3 ≥992px 响应式栅格 */
              md={{span: 12}}  /*4 ≥768px 响应式栅格 */
              sm={{span: 24}}  /*5 ≥576px 响应式栅格 */
              xl={{span: 12}}  /*2 ≥1200px 响应式栅格 */
              xs={{span: 24}}  /*6 <576px 响应式栅格 */
              xxl={{span: 12}} /*1 ≥1600px 响应式栅格 */
            >

              <div className="navbar-header clearfix">
                <a className="navbar-brand">
                  <img alt=""
                       src={require('../../assets/img/logo.svg')}/>
                  <span className="m-l-10">ADMIN</span>
                </a>
                <ul className="navbar-list">
                  <li className="navbar-list-item">
                    <Link to="/"><Icon type="home"/></Link>
                  </li>
                  <li className="navbar-list-item">
                    <Link to="/"><Icon type="calendar"/></Link>
                  </li>
                  <li className="navbar-list-item">
                    <Link to="/sign_in"><Icon type="shop"/></Link>
                  </li>
                  <li className="navbar-list-item">
                    <Link to="/sign_up"><Icon type="api"/></Link>
                  </li>
                </ul>
                <div className="input-group">
                  <input className="form-control" placeholder="Search..." type="text"/>
                  <span className="input-group-addon">
                    <i className="anticon anticon-search"></i>
                  </span>
                </div>
              </div>


            </Col>
            <Col
              lg={{span: 12}}  /* 3 */
              md={{span: 12}}  /* 4 */
              sm={{span: 0}}  /* 5 */
              xl={{span: 12}}  /* 2 */
              xs={{span: 0}}  /* 6 */
              xxl={{span: 12}} /* 1 */
            >
              <ul className="navbar-icon">
                <li className="navbar-icon-item">
                  <Link to="/"><Icon type="reload"/></Link>
                </li>
                <li className="navbar-icon-item">
                  <Link to="/"><Icon type="poweroff"/></Link>
                </li>
                <li className="navbar-icon-item">
                  <Link to="/"><Icon type="setting"/></Link>
                </li>
              </ul>
            </Col>
          </Row>
        </div>

        <div className="menu-container">
          <div className="menu">
            <ul className="pullDown clearfix">
              <li className="menu-dropdown-icon"><a href="javascript:;">常用快捷导航</a></li>
              <li className="menu-dropdown-icon"><Link to="/main/manager/index">主页</Link></li>
              <li className="menu-dropdown-icon"><Link to="/main/manager/user">管理</Link></li>
              <li className="menu-dropdown-icon"><Link to="/">网站配置</Link></li>
              <li className="menu-dropdown-icon"><Link to="/">数据备份</Link></li>
            </ul>
          </div>
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
