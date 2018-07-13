import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  HashRouter
} from 'react-router-dom'
import { Menu, Icon, Row, Col } from 'antd'

// bundle模型用来异步加载组件
import Bundle from '../Bundle'

// 同步加载
import Index from '../containers/Index/view'
import Header from '../containers/Parts/Header'
/* 头部 */
import Aside from '../containers/Parts/Aside'
/* 侧栏 */

// 异步加载
/*eslint-disable*/
import SignIn from 'bundle-loader?lazy!../containers/Sign/view/SignIn' //登录组件
import SignUp from 'bundle-loader?lazy!../containers/Sign/view/SignUp' //登录组件
/* HOME */
import User from 'bundle-loader?lazy!../containers/User/view/User'  /* 前台用户 */
import Article from 'bundle-loader?lazy!../containers/Article/view/Article'  /* 文章列表 */
import ArticleTag from 'bundle-loader?lazy!../containers/ArticleTag/view/ArticleTag'  /* 文章标签 */
import ArticleColumn from 'bundle-loader?lazy!../containers/ArticleColumn/view/ArticleColumn'  /* 文章标签 */
import UserTag from 'bundle-loader?lazy!../containers/UserTag/view/UserTag'  /* 用户标签 */
import Picture from 'bundle-loader?lazy!../containers/Picture/view/Picture'  /* 图片管理 */
/* ADMIN */
import adminUser from 'bundle-loader?lazy!../containers/adminUser/view/AdminUser' /* 后台管理员 */
import adminRole from 'bundle-loader?lazy!../containers/adminRole/view/AdminRole'  /* 后台角色 */
import adminAuthority from 'bundle-loader?lazy!../containers/adminAuthority/view/AdminAuthority' /* 后台权限 */

// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用
const createComponent = component => props => (
  <Bundle load={component}>
    {Component => <Component {...props} />}
  </Bundle>
)

const Main = ({ match }) => (
  <div className="admin-main-content-view">
    <Row gutter={24}>
      <Col
        lg={{ span: 5 }}  /*3 ≥992px 响应式栅格 */
        md={{ span: 6 }}  /*4 ≥768px 响应式栅格 */
        sm={{ span: 24 }}  /*5 ≥576px 响应式栅格 */
        xl={{ span: 4 }}  /*2 ≥1200px 响应式栅格 */
        xs={{ span: 24 }}  /*6 <576px 响应式栅格 */
        xxl={{ span: 3 }} /*1 ≥1600px 响应式栅格 */
      >
        <Aside />
      </Col>
      <Col
        lg={{ span: 19 }}  /* 3 */
        md={{ span: 18 }}  /* 4 */
        sm={{ span: 0 }}  /* 5 */
        xl={{ span: 20 }}  /* 2 */
        xs={{ span: 0 }}  /* 6 */
        xxl={{ span: 21 }} /* 1 */
      >
        <div className="admin-content-wrapper">
          <Route component={Index} exact path={`${match.url}/main`} />
          <Route component={createComponent(User)} exact path={`${match.url}/user`} />
          <Route component={createComponent(Article)} exact path={`${match.url}/article`} />
          <Route component={createComponent(ArticleTag)} exact path={`${match.url}/article_tag`} />
          <Route component={createComponent(ArticleColumn)} exact path={`${match.url}/article_column`} />
          <Route component={createComponent(UserTag)} exact path={`${match.url}/user_tag`} />
          <Route component={createComponent(Picture)} exact path={`${match.url}/picture`} />
          <Route component={createComponent(adminUser)} exact path={`${match.url}/adminUser`} />
          <Route component={createComponent(adminRole)} exact path={`${match.url}/adminRole`} />
          <Route component={createComponent(adminAuthority)} exact path={`${match.url}/adminAuthority`} />
        </div>
      </Col>
    </Row>
  </div>
)

const Admin = ({ match }) => (
  <div>
    <Header />
    <div className="admin-main-content">
      <div className="block-header">
        <Row>
          <Col
            lg={{ span: 12 }}  /*3 ≥992px 响应式栅格 */
            md={{ span: 12 }}  /*4 ≥768px 响应式栅格 */
            sm={{ span: 24 }}  /*5 ≥576px 响应式栅格 */
            xl={{ span: 12 }}  /*2 ≥1200px 响应式栅格 */
            xs={{ span: 24 }}  /*6 <576px 响应式栅格 */
            xxl={{ span: 12 }} /*1 ≥1600px 响应式栅格 */
          >
            <h2>Horizontal Menu Dashboad
                <small>Welcome to Oreo</small>
            </h2>
          </Col>
          <Col
            lg={{ span: 12 }}  /* 3 */
            md={{ span: 12 }}  /* 4 */
            sm={{ span: 0 }}  /* 5 */
            xl={{ span: 12 }}  /* 2 */
            xs={{ span: 0 }}  /* 6 */
            xxl={{ span: 12 }} /* 1 */
          >
          </Col>
        </Row>
      </div>

      <Route component={Main} path={`${match.url}/index`} />
      <Route component={Index} path={`${match.url}/ma`} />
    </div>
  </div>
)

class RouteConfig extends Component {
  render() {
    return (
      <HashRouter>
        <div className="app-view">
          <Route component={Admin} path="/master" />
          <Route component={createComponent(SignIn)} exact path="/sign_in" />
          <Route component={createComponent(SignUp)} exact path="/sign_up" />
          <Route exact path="/" render={() => (
            <Redirect to="/master/index/main" />
          )} />
        </div>
      </HashRouter>
    )
  }
}

export default RouteConfig
