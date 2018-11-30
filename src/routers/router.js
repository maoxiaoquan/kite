import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  HashRouter,
  browserHistory
} from 'react-router-dom'
import { Menu, Icon, Row, Col, Layout } from 'antd'

import routerConfig from '../config/router.config'

const {Content, Footer, Sider} = Layout
// bundle模型用来异步加载组件
import Bundle from '../Bundle'
import { connect } from 'react-redux'

// 同步加载
import Index from '../containers/Index/view'

import Header from '../components/Parts/Header' // 头部

import Aside from '../components/Parts/Aside' // 侧栏

// 异步加载
/*eslint-disable*/
import SignIn from 'bundle-loader?lazy!../containers/Sign/view/SignIn' //登录组件
/* HOME */
import User from 'bundle-loader?lazy!../containers/User/view/User' // 前台用户

import Article from 'bundle-loader?lazy!../containers/Article/view/Article' // 文章汇总

import ArticleReview from 'bundle-loader?lazy!../containers/ArticleReview/view/ArticleReview' // 文章审核

import ArticleTag from 'bundle-loader?lazy!../containers/ArticleTag/view/ArticleTag' // 文章标签

import ArticleColumn from 'bundle-loader?lazy!../containers/ArticleColumn/view/ArticleColumn' // 文章标签

import UserTag from 'bundle-loader?lazy!../containers/UserTag/view/UserTag' // 用户标签

import Picture from 'bundle-loader?lazy!../containers/Picture/view/Picture' // 图片管理

import Comment from 'bundle-loader?lazy!../containers/Comment/view/Comment' // 评论管理

/* ADMIN */
import adminUser from 'bundle-loader?lazy!../containers/adminUser/view/AdminUser' // 后台管理员

import adminRole from 'bundle-loader?lazy!../containers/adminRole/view/AdminRole' // 后台角色

import adminAuthority from 'bundle-loader?lazy!../containers/adminAuthority/view/AdminAuthority' // 后台权限

import AdminSystemLog from 'bundle-loader?lazy!../containers/AdminSystemLog/view/AdminSystemLog' // 后台系统日志

import { get_admin_user_info } from '../stores/actions'
// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用
const createComponent = component => props => (
  <Bundle load={component}>{Component => <Component {...props} />}</Bundle>
)

import Loadable from 'react-loadable'

const LoadingComponent = ({isLoading, error}) => {
  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>
  }
  else {
    return null
  }
}

const AsyncHome = Loadable({
  loader: () => import('../containers/AdminSystemLog/view/AdminSystemLog'),
  loading: LoadingComponent
})

class Manager extends Component {

  componentDidMount () {
    // 公共信息
    this.props.dispatch(get_admin_user_info())
  }

  render () {
    const {match} = this.props
    return (
      <Layout>
        <Aside/>
        <Layout style={{marginLeft: 200}}>
          <Header/>
          <Content style={{margin: '24px 16px 0', overflow: 'initial'}}>
            <div className="admin-manager">
              <div className="admin-wrapper">
                <div className="admin-content">
                  <Route component={Index} exact path={`${match.url}/index`}/>
                  <Route
                    component={
                      Loadable({
                        loader: () => import('../containers/User/view/User'),
                        loading: LoadingComponent
                      })}
                    exact
                    path={`${match.url}/user`}
                  />
                  <Route
                    component={createComponent(Article)}
                    exact
                    path={`${match.url}/article`}
                  />
                  <Route
                    component={createComponent(ArticleReview)}
                    exact
                    path={`${match.url}/article_review`}
                  />
                  <Route
                    component={createComponent(ArticleTag)}
                    exact
                    path={`${match.url}/article_tag`}
                  />
                  <Route
                    component={createComponent(Comment)}
                    exact
                    path={`${match.url}/comment`}
                  />
                  <Route
                    component={createComponent(ArticleColumn)}
                    exact
                    path={`${match.url}/article_column`}
                  />
                  <Route
                    component={createComponent(UserTag)}
                    exact
                    path={`${match.url}/user_tag`}
                  />
                  <Route
                    component={createComponent(Picture)}
                    exact
                    path={`${match.url}/picture`}
                  />
                  <Route
                    component={createComponent(adminUser)}
                    exact
                    path={`${match.url}/admin_user`}
                  />
                  <Route
                    component={createComponent(adminRole)}
                    exact
                    path={`${match.url}/admin_role`}
                  />
                  <Route
                    component={createComponent(adminAuthority)}
                    exact
                    path={`${match.url}/admin_authority`}
                  />
                  <Route
                    component={createComponent(AdminSystemLog)}
                    exact
                    path={`${match.url}/admin_system_log`}
                  />
                </div>
              </div>
            </div>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    )
  }
}

const _Manager = connect(({state_title}) => {
  return {
    state_title
  }
})(Manager)

class RouteConfig extends Component {

  render () {
    return (
      <HashRouter history={browserHistory}>
        <div className="app-view">
          {
            routerConfig.map((route, key) => {
              console.log('route', route)
              return (
                <Route
                  component={
                    Loadable({
                      loader: route.component,
                      loading: LoadingComponent
                    })}
                  key={key}
                  exact
                  path={route.path}
                />
              )
            })
          }
          {/* <Route component={createComponent(SignIn)} exact path="/sign_in"/>*/}
          <Route component={_Manager} path="/Manager"/>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/manager/index"/>}
          />
        </div>
      </HashRouter>
    )
  }
}

export default RouteConfig
