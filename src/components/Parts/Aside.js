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
  state = {
    openKeys: ['web'],
    aside_list: [
      {
        title: '主页',
        key: 'index',
        icon: 'home',
        link: '/manager/index'
      },
      {
        title: '网站管理',
        key: 'web',
        icon: 'mail',
        children: [
          {
            title: '用户管理',
            key: 'user',
            link: '/manager/user'
          },
          {
            title: '文章管理',
            key: 'article',
            link: '/manager/article'
          },
          {
            title: '文章标签',
            key: 'article_tag',
            link: '/manager/article_tag'
          },
          {
            title: '文章专栏',
            key: 'article_column',
            link: '/manager/article_column'
          },
          {
            title: '用户标签',
            key: 'user_tag',
            link: '/manager/user_tag'
          },
          {
            title: '图片管理',
            key: 'picture',
            link: '/manager/picture'
          },
          {
            title: '评论管理',
            key: 'comment',
            link: '/manager/comment'
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
            link: '/manager/admin_user'
          },
          {
            title: '角色管理',
            key: 'admin_role',
            link: '/manager/admin_role'
          },
          {
            title: '权限菜单',
            key: 'admin_authority',
            link: '/manager/admin_authority'
          },
          {
            title: '系统日志',
            key: 'admin_system_log',
            link: '/manager/admin_system_log'
          }
        ]
      }
    ]
  }

  handleClick = (e) => {
    console.log('click ', e)
  }

  render () {
    const {aside_list = []} = this.state

    return (
      <div className="admin-side-menu">
        <div className="admin-side-scroll">

          <div className="admin-logo">
            <Link className="admin-logo-text" to="/manager/index">Kite</Link>
            <span className="user-tag">超级管理员</span>
          </div>

          <div className="admin-aside-nav clearfix">

            <Menu
              onClick={this.handleClick}
              defaultOpenKeys={['web']}
              theme={'dark'}
              mode="inline"
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
                        <SubMenu key={item.key} title={<span><Icon
                          type={item.icon}/><span>{item.title}</span></span>}>
                          {
                            item.children.map(child_item => {
                              return (
                                <Menu.Item key={child_item.key}>
                                  <Link to={child_item.link}>
                                    {child_item.icon ? <Icon
                                      type={child_item.icon}/> : ''}{child_item.title}
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
