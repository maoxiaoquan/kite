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
  }

  render () {
    const {state_title} = this.props
    return (
      <div className="layout-index">

        <div className="layout-one">
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
                <i className="iconfont icon-survey"></i>
                <div className="content">
                  <p>文章总数</p>
                  <strong>4656</strong>
                </div>
              </div>
            </Col>
            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-pinglun"></i>
                <div className="content">
                  <p>评论总数</p>
                  <strong>31564</strong>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <Row gutter={24}>
            <Col span={5}>
              <div className="box-card user-info">
                <div className="header">
                  <img src={require('../../../assets/img/camera1.jpg')} alt=""/>
                  <div className="avatar">
                    <img src="http://oq33egsog.bkt.clouddn.com/avatar1.jpg" alt=""/>
                  </div>
                </div>
                <div className="info-pannel">
                  <h2 className="name">超级管理员小白</h2>
                  <ul className="text">
                    <li><label>上次登录时间：</label>2018-10-17 17:19:52</li>
                    <li><label>上次登录IP：</label>125.36.117.156</li>
                    <li><label>我的权限：</label>
                      <Button type="primary" icon="search" size={'small'}>查看</Button>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>

            <Col span={5}>
              <div className="box-card weather">
                <div className="location"><span>New York</span></div>
                <div className="date"><span>Mon 29 May</span></div>
                <div className="daily-forecast">
                  <div className="info">
                    <div className="temperature"><span>20°</span></div>
                    <div className="icon"><i className="ion-ios-sunny-outline"></i></div>
                  </div>
                  <div className="details">
                    <div className="parameter">
                      <span className="parameter-name">max</span>
                      <span className="parameter-value">23°</span></div>
                    <div className="parameter">
                      <span className="parameter-name">min</span>
                      <span className="parameter-value">19°</span>
                    </div>
                    <div className="parameter">
                      <span className="parameter-name">wind</span>
                      <span className="parameter-value">4 km/h</span>
                    </div>
                    <div className="parameter">
                      <span className="parameter-name">hum</span>
                      <span className="parameter-value">87%</span></div>
                  </div>
                </div>
                <div className="weekly-forecast">
                  <div className="day">
                    <span className="caption">Sun</span>
                    <i className="ion-ios-cloudy-outline"></i>
                    <span className="temperature">17°</span>
                  </div>
                  <div className="day"><span className="caption">Mon</span>
                    <i className="ion-ios-sunny-outline"></i>
                    <span className="temperature">19°</span>
                  </div>
                  <div className="day">
                    <span className="caption">Tue</span>
                    <i className="ion-ios-rainy-outline"></i>
                    <span className="temperature">22°</span>
                  </div>
                  <div className="day"><span className="caption">Wed</span>
                    <i className="ion-ios-partlysunny-outline"></i>
                    <span className="temperature">21°</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col span={14}>
              <div className="box-card user-info">
                <div className="el-card__header">
                  <div className="">
                    <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png" alt=""/>
                  </div>
                </div>
                <div className="el-card__body">
                  <div>
                    <a href="#" className="link--mallki mallki-text">
                      doracms
                      <span></span>
                      <span></span>
                    </a>
                    <div className="info-pannel">
                      <ul>
                        <li><label>上次登录时间：</label>2018-10-17 17:19:52</li>
                        <li><label>上次登录IP：</label>125.36.117.156</li>
                        <li><label>我的权限：</label>
                          <button type="button" className="el-button el-button--text el-button--mini"><span>查看</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
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
