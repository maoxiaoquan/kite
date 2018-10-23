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
  // submenu keys of first level
  rootSubmenuKeys = ['web', 'admin']

  state = {
    openKeys: ['web'],
    aside_list: [
      {
        title: '主页',
        key: 'index',
        icon: 'home',
        link: '/main/manager/index'
      },
      {
        title: '网站管理',
        key: 'web',
        icon: 'mail',
        children: [
          {
            title: '用户管理',
            key: 'user',
            link: '/main/manager/user'
          },
          {
            title: '文章管理',
            key: 'article',
            link: '/main/manager/article'
          },
          {
            title: '文章标签',
            key: 'article_tag',
            link: '/main/manager/article_tag'
          },
          {
            title: '文章专栏',
            key: 'article_column',
            link: '/main/manager/article_column'
          },
          {
            title: '用户标签',
            key: 'user_tag',
            link: '/main/manager/user_tag'
          },
          {
            title: '图片管理',
            key: 'picture',
            link: '/main/manager/picture'
          },
          {
            title: '评论管理',
            key: 'comment',
            link: '/main/manager/comment'
          }
        ]
      },
      {
        title: '系统管理',
        key: 'admin',
        icon: 'mail',
        children: [
          {
            title: '管理员管理',
            key: 'admin_user',
            link: '/main/manager/admin_user'
          },
          {
            title: '角色管理',
            key: 'admin_role',
            link: '/main/manager/admin_role'
          },
          {
            title: '权限菜单',
            key: 'admin_authority',
            link: '/main/manager/admin_authority'
          },
          {
            title: '系统日志',
            key: 'admin_system_log',
            link: '/main/manager/admin_system_log'
          }
        ]
      }
    ]
  }

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({openKeys})
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      })
    }
  }

  render () {
    const {aside_list = []} = this.state

    return (
      <div className="admin-aside " id="admin-aside">
        <div className="admin-aside-content box-card">


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
              onOpenChange={this.onOpenChange}
              openKeys={this.state.openKeys}
            >
              {
                aside_list.map(item => {
                    if (item.link) {
                      return (
                        <Menu.Item key={item.key}>
                          <Link to={item.link}>
                            {item.icon ? <Icon type={item.icon}/> : ''}{item.title}
                          </Link>
                        </Menu.Item>
                      )
                    } else {
                      return (
                        <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                          {
                            item.children.map(child_item => {
                              return (
                                <Menu.Item key={child_item.key}>
                                  <Link to={child_item.link}>
                                    {child_item.icon ? <Icon type={child_item.icon}/> : ''}{child_item.title}
                                  </Link>
                                </Menu.Item>
                              )
                            })
                          }
                        </SubMenu>
                      )
                    }
                  }
                )
              }
            </Menu>
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
})(Aside)
