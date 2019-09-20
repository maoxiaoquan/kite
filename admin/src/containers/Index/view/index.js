import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Row, Col, List, Avatar, Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import './index.scss'
import stateIndex from '../reducer/IndexReducer'
import { getAdminIndexStatistics } from '../actions'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sex_arr: {
        0: '未知',
        1: '男',
        2: '女'
      }
    }
  }

  componentWillMount () {
    this.props.dispatch(getAdminIndexStatistics())
  }

  render () {
    const {
      stateIndex: {
        articleBlogCount = {},
        articleCommentCount = {},
        articleCount = {},
        count = {},
        dynamicCommentCount = {},
        dynamicCount = {},
        new_article = [],
        new_comment = [],
        new_user = []
      }
    } = this.props
    const { sex_arr } = this.state
    return (
      <div className="layout-index layout-main">
        <div className="layout-main-title">
          <Breadcrumb>
            <Breadcrumb.Item href="#/manager/index">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#/manager/index">
              <span>主页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>仪表盘</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="layout-statistics">
          <div className="big-statistics">
            <Row gutter={24}>
              <Col span={6} className="count-view">
                <div class="card separate-card">
                  <div class="card-body">
                    <div class="float-right">
                      <Icon
                        type="file-text"
                        className="big-widget-icon text-danger"
                      />
                    </div>
                    <h5
                      class="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      文章总数
                    </h5>
                    <h3 class="mt-3 mb-3">{articleCount.allCount}</h3>
                    <p class="mb-0 text-muted">
                      <span class="text-nowrap">统计所有的文章</span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={6} className="count-view ">
                <div class="card separate-card">
                  <div class="card-body">
                    <div class="float-right">
                      <Icon
                        type="message"
                        className="big-widget-icon text-primary"
                      />
                    </div>
                    <h5
                      class="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      片刻总数
                    </h5>
                    <h3 class="mt-3 mb-3">{dynamicCount.allCount}</h3>
                    <p class="mb-0 text-muted">
                      <span class="text-nowrap">统计所有的用户发表的说说</span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={6} className="count-view">
                <div class="card  separate-card">
                  <div class="card-body">
                    <div class="float-right">
                      <Icon type="read" className="big-widget-icon text-info" />
                    </div>
                    <h5
                      class="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      个人专栏总数
                    </h5>
                    <h3 class="mt-3 mb-3">{articleBlogCount.allCount}</h3>
                    <p class="mb-0 text-muted">
                      <span class="text-nowrap">统计所有的个人公开的专栏</span>
                    </p>
                  </div>
                </div>
              </Col>

              <Col span={6} className="count-view ">
                <div class="card  separate-card">
                  <div class="card-body">
                    <div class="float-right">
                      <Icon
                        type="user"
                        className="big-widget-icon text-primary"
                      />
                    </div>
                    <h5
                      class="text-muted font-weight-normal mt-0"
                      title="Number of Customers"
                    >
                      用户总数
                    </h5>
                    <h3 class="mt-3 mb-3">{articleCount.allCount}</h3>
                    <p class="mb-0 text-muted">
                      <span class="text-nowrap">统计所有的用户</span>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Row gutter={24}>
            <Col span={10} className="left-view">
              <Row gutter={24}>
                <Col span={12} className="count-view">
                  <div class="xsb-card  separate-card">
                    <div class="xsb-card-body">
                      <div class="float-right">
                        <Icon type="read" className="widget-icon" />
                      </div>
                      <h5
                        class="text-muted font-weight-normal mt-0"
                        title="Number of Customers"
                      >
                        个人专栏无需审核
                      </h5>
                      <h3 class="mt-3 mb-3">
                        {articleBlogCount.noReviewCount}
                      </h3>
                      <p class="mb-0 text-muted">
                        <span class="text-nowrap">
                          统计所有的个人公开的专栏
                        </span>
                      </p>
                    </div>
                  </div>
                </Col>

                <Col span={12} className="count-view ">
                  <div class="xsb-card  separate-card">
                    <div class="xsb-card-body">
                      <div class="float-right">
                        <Icon type="read" className="widget-icon" />
                      </div>
                      <h5
                        class="text-muted font-weight-normal mt-0"
                        title="Number of Customers"
                      >
                        个人专栏待审核
                      </h5>
                      <h3 class="mt-3 mb-3">{articleCount.reviewCount}</h3>
                      <p class="mb-0 text-muted">
                        <span class="text-nowrap">统计所有的用户</span>
                      </p>
                    </div>
                  </div>
                </Col>

                <Col span={12} className="count-view">
                  <div class="xsb-card separate-card">
                    <div class="xsb-card-body">
                      <div class="float-right">
                        <Icon type="file-text" className="widget-icon" />
                      </div>
                      <h5
                        class="text-muted font-weight-normal mt-0"
                        title="Number of Customers"
                      >
                        文章评论总数
                      </h5>
                      <h3 class="mt-3 mb-3">{articleCommentCount.allCount}</h3>
                      <p class="mb-0 text-muted">
                        <span class="text-nowrap">统计所有的文章评论</span>
                      </p>
                    </div>
                  </div>
                </Col>

                <Col span={12} className="count-view ">
                  <div class="xsb-card separate-card">
                    <div class="xsb-card-body">
                      <div class="float-right">
                        <Icon type="message" className="widget-icon" />
                      </div>
                      <h5
                        class="text-muted font-weight-normal mt-0"
                        title="Number of Customers"
                      >
                        片刻评论总数
                      </h5>
                      <h3 class="mt-3 mb-3">{dynamicCommentCount.allCount}</h3>
                      <p class="mb-0 text-muted">
                        <span class="text-nowrap">统计片刻评论总数</span>
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col span={14} className="right-view">
              <div class="card total-card">
                <div class="card-body">
                  <h4 class="header-title">数据统计</h4>
                  <div className="table-responsive count-view-table">
                    <table
                      border="0"
                      className="table table-centered table-hover mb-0"
                    >
                      <tbody>
                        <tr>
                          <th>标题</th>

                          <th>无需审核</th>
                          <th>待审核</th>
                          <th>审核失败</th>
                        </tr>
                        <tr>
                          <td>文章</td>
                          <td>{articleBlogCount.noReviewCount}</td>
                          <td>{articleBlogCount.reviewCount}</td>
                          <td>{articleBlogCount.reviewFailCount}</td>
                        </tr>
                        <tr>
                          <td>文章评论</td>
                          <td>{articleCommentCount.noReviewCount}</td>
                          <td>{articleCommentCount.reviewCount}</td>
                          <td>{articleCommentCount.reviewFailCount}</td>
                        </tr>
                        <tr>
                          <td>动态</td>
                          <td>{dynamicCount.noReviewCount}</td>
                          <td>{dynamicCount.reviewCount}</td>
                          <td>{dynamicCount.reviewFailCount}</td>
                        </tr>
                        <tr>
                          <td>动态评论</td>
                          <td>{dynamicCommentCount.noReviewCount}</td>
                          <td>{dynamicCommentCount.reviewCount}</td>
                          <td>{dynamicCommentCount.reviewFailCount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="layout-detailed">
          <Row gutter={24}>
            <Col span={12}>
              <div className="card clearfix">
                <div className="card-body">
                  <div className="header-title">最新文章</div>
                  <div className="limit-height">
                    <List
                      itemLayout="horizontal"
                      dataSource={new_article}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.user.avatar} />}
                            title={
                              <a href={`/p/${item.aid}`}>
                                {item.title} {item.create_dt}
                              </a>
                            }
                            description={item.excerpt}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col span={6}>
              <div className="card clearfix">
                <div className="card-body">
                  <div className="header-title">最新注册用户</div>
                  <div className="limit-height">
                    <List
                      itemLayout="horizontal"
                      dataSource={new_user}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.avatar} />}
                            title={
                              <a href={`/user/${item.uid}/blog`}>
                                {item.nickname}
                              </a>
                            }
                            description={sex_arr[item.sex]}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col span={6}>
              <div className="card clearfix">
                <div className="card-body">
                  <div className="header-title">最新评论</div>
                  <div className="limit-height">
                    <List
                      itemLayout="horizontal"
                      dataSource={new_comment}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.user.avatar} />}
                            title={
                              <a href={`/p/${item.aid}`}>
                                {item.user.nickname} {item.create_dt}
                              </a>
                            }
                            description={item.content}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default connect(({ stateIndex }) => {
  return {
    stateIndex
  }
})(Index)
