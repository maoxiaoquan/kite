import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Layout, Icon, Row, Col, Progress } from 'antd'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import axios from 'axios'
import ScrollBar from '../ScrollBar'

import './aside.scss'
import { getAdminUserInfo } from '../../stores/actions'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

class Aside extends Component {
  // submenu keys of first level
  state = {
    openKeys: ['web'],
    isMobile: false,
    aside_list: [
      {
        title: '主页',
        key: 'index',
        icon: 'home',
        link: '/manager/index'
      },
      {
        title: '文章管理',
        key: 'article_mange',
        icon: 'file-text',
        children: [
          {
            title: '文章汇总',
            key: 'article',
            link: '/manager/article'
          },
          {
            title: '个人专栏',
            key: 'articleBlog',
            link: '/manager/article-blog'
          },
          {
            title: '文章标签',
            key: 'article_tag',
            link: '/manager/article-tag'
          },
          {
            title: '文章专栏',
            key: 'article_column',
            link: '/manager/article-column'
          },
          {
            title: '文章评论管理',
            key: 'comment',
            link: '/manager/article-comment'
          }
        ]
      },
      {
        title: '动态管理',
        key: 'dynamic',
        icon: 'message',
        children: [
          {
            title: '动态汇总',
            key: 'dynamics',
            link: '/manager/dynamic'
          },
          {
            title: '动态话题',
            key: 'dynamicTopic',
            link: '/manager/dynamic-topic'
          },
          {
            title: '动态评论',
            key: 'dynamicComment',
            link: '/manager/dynamic-comment'
          }
        ]
      },
      {
        title: '小书管理',
        key: 'bookManager',
        icon: 'book',
        children: [
          {
            title: '小书',
            key: 'books',
            link: '/manager/books'
          },
          {
            title: '小书章节',
            key: 'book',
            link: '/manager/book'
          },
          {
            title: '小书评论',
            key: 'booksComment',
            link: '/manager/books-comment'
          },
          {
            title: '小书章节评论',
            key: 'bookComment',
            link: '/manager/book-comment'
          }
        ]
      },
      {
        title: '用户管理',
        key: 'user_manger',
        icon: 'user',
        children: [
          {
            title: '用户管理',
            key: 'user',
            link: '/manager/user'
          },
          {
            title: '用户角色',
            key: 'user_role',
            link: '/manager/user-role'
          },
          {
            title: '用户权限',
            key: 'user_authority',
            link: '/manager/user-authority'
          },
          {
            title: '用户头像审核',
            key: 'user_avatar_review',
            link: '/manager/user-avatar-review'
          }
        ]
      },
      {
        title: '网站管理',
        key: 'web',
        icon: 'desktop',
        children: [
          {
            title: '网站配置',
            key: 'website_config',
            link: '/manager/website-config'
          },
          {
            title: '图库',
            key: 'picture',
            link: '/manager/picture'
          }
        ]
      },
      {
        title: '系统管理',
        key: 'admin',
        icon: 'setting',
        children: [
          {
            title: '管理员管理',
            key: 'admin_user',
            link: '/manager/admin-user'
          },
          {
            title: '角色管理',
            key: 'admin_role',
            link: '/manager/admin-role'
          },
          {
            title: '权限菜单',
            key: 'admin_authority',
            link: '/manager/admin-authority'
          },
          {
            title: '系统配置',
            key: 'system_config',
            link: '/manager/system-config'
          },
          {
            title: '系统日志',
            key: 'admin_system_log',
            link: '/manager/admin-system-log'
          }
        ]
      }
    ]
  }

  rootSubmenuKeys = [
    'home',
    'article_mange',
    'bookManager',
    'dynamic',
    'user_manger',
    'web',
    'admin'
  ]

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    )
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      })
    }
  }

  componentDidMount() {
    this.eHandler = enquireScreen(mobile => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        })
      }
    })
  }

  componentWillUnmount() {
    unenquireScreen(this.eHandler)
  }

  render() {
    const { aside_list = [], isMobile } = this.state
    const { collapsed, onCollapseChange, stateMange } = this.props
    return (
      <Layout.Sider
        breakpoint="lg"
        trigger={null}
        width={isMobile ? 200 : 256}
        collapsible
        collapsed={collapsed}
        onCollapse={(collapsed, type) => {
          onCollapseChange(collapsed)
        }}
        className="admin-aside-menu"
      >
        <div className="admin-aside-menu-view">
          <div className="admin-aside-header">
            <Link className="admin-logo-view" to="/manager/index">
              <Icon type="heat-map" className="login-icon" />
              <span className="logo-text">
                {stateMange.website && stateMange.website.website_name}
              </span>
            </Link>
          </div>

          <div className="admin-aside-content clearfix">
            <ScrollBar
              option={{
                suppressScrollX: true
              }}
            >
              <Menu
                defaultOpenKeys={['web']}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                theme="dark"
                mode="inline"
              >
                <Menu.Item>
                  <Link to="#">
                    <Icon type=" " />
                    <span>NAVIGATION</span>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/manager/index">
                    <Icon type="dashboard" />
                    <span>仪表盘</span>
                  </Link>
                </Menu.Item>
                {aside_list.map(item => {
                  if (
                    item.link &&
                    stateMange.asideList &&
                    ~stateMange.asideList.indexOf(item.key)
                  ) {
                    return (
                      <Menu.Item key={item.key}>
                        <Link to={item.link}>
                          {item.icon ? <Icon type={item.icon} /> : ''}
                          <span>{item.title}</span>
                        </Link>
                      </Menu.Item>
                    )
                  } else if (
                    stateMange.asideList &&
                    ~stateMange.asideList.indexOf(item.key)
                  ) {
                    return (
                      <SubMenu
                        key={item.key}
                        title={
                          <span>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                          </span>
                        }
                      >
                        {item.children.map(child_item => {
                          if (~stateMange.asideList.indexOf(child_item.key)) {
                            return (
                              <Menu.Item key={child_item.key}>
                                <Link to={child_item.link}>
                                  {child_item.icon ? (
                                    <Icon type={child_item.icon} />
                                  ) : (
                                    ''
                                  )}
                                  {child_item.title}
                                </Link>
                              </Menu.Item>
                            )
                          }
                        })}
                      </SubMenu>
                    )
                  }
                })}
              </Menu>
            </ScrollBar>
          </div>
        </div>
      </Layout.Sider>
    )
  }
}

export default connect(({ stateMange }) => ({ stateMange }))(Aside)
