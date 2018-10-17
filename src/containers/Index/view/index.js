import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Table, Card, Row, Col } from 'antd'
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
  }

  render () {
    const {state_title} = this.props
    return (
      <div className="layout-index">

        <div>
          <Row gutter={24}>
            <Col span={6}>
              <Card bordered={false}>

              </Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>Card content</Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>Card content</Card>
            </Col>
            <Col span={6}>
              <Card bordered={false}>Card content</Card>
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
            <div className="box-card user-info">
              66
            </div>
          </Col>
          <Col
            lg={{span: 19}}  /* 3 */
            md={{span: 18}}  /* 4 */
            sm={{span: 0}}  /* 5 */
            xl={{span: 20}}  /* 2 */
            xs={{span: 0}}  /* 6 */
            xxl={{span: 21}} /* 1 */
          >
            <div className="box-card">
              <div className="box-card-header">
                <h2><strong>Product</strong> Report</h2>
                {/*
                  <ul className="header-dropdown">
                    <li className="dropdown">
                      <a className="dropdown-toggle" href="javascript:void(0);" >
                        <Icon type="ellipsis" />
                      </a>
                    </li>
                    <li className="remove">
                      <a className="boxs-close" role="button">
                        <Icon type="close" />
                      </a>
                    </li>
                  </ul>
                 */}
              </div>
              <div className="box-card-body">
                <div>
                </div>
              </div>
            </div>
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
