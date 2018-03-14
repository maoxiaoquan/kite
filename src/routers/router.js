import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
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
import List from 'bundle-loader?lazy!../containers/List/view/list' // 表单组件
import About from 'bundle-loader?lazy!../containers/About/view/about' // 评论组件
/* eslint-enable */

// components load their module for initial visit
// //这里只是给this.props.child传一个方法，最后在Bundle的render里面调用
const createComponent = component => props => (
  <Bundle load={component}>
    {Component => <Component {...props} />}
  </Bundle>
)

const Main = ({ match }) => (
  <div className="admin-main-content-view">
    <Row>
      <Col
        lg={{ span: 5 }}   /*3 ≥992px 响应式栅格  */
        md={{ span: 6 }}   /*4 ≥768px 响应式栅格  */
        sm={{ span: 24 }}  /*5 ≥576px 响应式栅格  */
        xl={{ span: 5 }}   /*2 ≥1200px 响应式栅格 */
        xs={{ span: 24 }}  /*6 <576px 响应式栅格  */
        xxl={{ span: 4 }}  /*1 ≥1600px 响应式栅格 */
      >
        <Aside />
      </Col>
      <Col
        lg={{ span: 19 }}  /* 3 */
        md={{ span: 18 }}  /* 4 */
        sm={{ span: 0 }}  /* 5 */
        xl={{ span: 19 }}  /* 2 */
        xs={{ span: 0 }}  /* 6 */
        xxl={{ span: 20 }} /* 1 */
      >
        <div className="admin-content-wrapper">
          <p>{match.url}</p>
          <Route component={Index} path={`${match.url}/index`} />
        </div>
      </Col>
    </Row>
  </div>
)

const RouteConfig = () => (
  <Router>
    <div>
      <Header />
      <div className="admin-main-content">
        <Route component={Main} path="/main" />
        <Route component={Index} path="/Index" />
        <Redirect to="/main/index" />
      </div>
    </div>
  </Router>
)

export default RouteConfig
