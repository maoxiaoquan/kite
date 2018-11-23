import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Table, Card, Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import './index.scss'

const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      one: '刷66666666666新'
    }
  }

  componentWillMount () {
    // console.log(this.props.dispatch(sign_in()))
    // this.props.dispath(sign_in())
    console.log('this.props', this.props)
  }

  render () {
    const {state_title} = this.props
    return (
      <div className="layout-index layout-main">

        <div className="layout-main-title">
          <Icon type="home"/> <em>首页</em>
        </div>

        <div>

          <Row gutter={24}>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-guanliyuan"></i>
                <div className="content">
                  <p>管理员</p>
                  <strong>20</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-duouser"></i>
                <div className="content">
                  <p>用户数</p>
                  <strong>862</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-guanliyuan"></i>
                <div className="content">
                  <p>管理员</p>
                  <strong>20</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-duouser"></i>
                <div className="content">
                  <p>用户数</p>
                  <strong>862</strong>
                </div>
              </div>
            </Col>

          </Row>
        </div>

        <Row gutter={24}>
          <Col
            lg={{span: 5}}  /*3 ≥992px 响应式栅格 */
            md={{span: 6}}  /*4 ≥768px 响应式栅格 */
            sm={{span: 24}}  /*5 ≥576px 响应式栅格 */
            xl={{span: 4}}  /*2 ≥1200px 响应式栅格 */
            xs={{span: 24}}  /*6 <576px 响应式栅格 */
            xxl={{span: 3}} /*1 ≥1600px 响应式栅格 */
          >
          </Col>
          <Col
            lg={{span: 19}}  /* 3 */
            md={{span: 18}}  /* 4 */
            sm={{span: 0}}  /* 5 */
            xl={{span: 20}}  /* 2 */
            xs={{span: 0}}  /* 6 */
            xxl={{span: 21}} /* 1 */
          >
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect((state_title) => {
  return {
    state_title
  }
})(Index)
