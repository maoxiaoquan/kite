import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Table, Card, Button, List, Avatar, Row, Col, Timeline } from 'antd'
import { Link } from 'react-router-dom'
import './index.scss'
import state_index from '../reducer/IndexReducer'
import { get_admin_index_statistics } from '../actions'

const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

class Index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sex_arr: {
        '0': '未知',
        '1': '男',
        '2': '女'
      }
    }
  }

  componentWillMount () {
    this.props.dispatch(get_admin_index_statistics())
  }

  render () {
    const {state_index: {count = {}, new_article = [], new_user = []}} = this.props
    const {sex_arr} = this.state
    return (
      <div className="layout-index layout-main">

        <div className="layout-main-title">
          <Icon type="home"/> <em>首页</em>
        </div>

        <div className="layout-count">

          <Row gutter={24}>

            <Col span={6} className="count-view">
              <div className="box-card clearfix">
                <i className="iconfont icon-guanliyuan"></i>
                <div className="content">
                  <p>管理员</p>
                  <strong>{count.admin_user_count}</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-duouser"></i>
                <div className="content">
                  <p>用户数</p>
                  <strong>{count.user_count}</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-form"></i>
                <div className="content">
                  <p>文章数</p>
                  <strong>{count.article_count}</strong>
                </div>
              </div>
            </Col>

            <Col span={6} className="count-view ">
              <div className="box-card clearfix">
                <i className="iconfont icon-comments"></i>
                <div className="content">
                  <p>总评论数</p>
                  <strong>{count.comment_count}</strong>
                </div>
              </div>
            </Col>

          </Row>
        </div>

        <div className="layout-detailed">

          <Row gutter={24}>

            <Col span={10}>
              <div className="box-card clearfix">
                <div className="box-card-header">
                  <h2>最新文章</h2>
                </div>
                <div className="box-card-body">
                  <div className="limit-height">
                    <List
                      itemLayout="horizontal"
                      dataSource={new_article}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.user.avatar}/>}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={item.excerpt}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col span={7}>
              <div className="box-card clearfix">
                <div className="box-card-header">
                  <h2>最新注册用户</h2>
                </div>
                <div className="box-card-body">
                  <div className="limit-height">
                    <List
                      itemLayout="horizontal"
                      dataSource={new_user}
                      renderItem={item => {
                        return (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar src={item.avatar}/>}
                              title={<a href="https://ant.design">{item.nickname}</a>}
                              description={sex_arr[item.sex]}
                            />
                          </List.Item>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Col span={7}>
              <div className="box-card clearfix">
                <div className="box-card-header">
                  <h2>版本更新历史</h2>
                </div>
                <div className="box-card-body">
                  <div className="limit-height">
                    <Timeline mode="alternate">
                      <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                      <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
                      <Timeline.Item dot={<Icon type="clock-circle-o" style={{fontSize: '16px'}}/>}>Sed ut perspiciatis
                        unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                        eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                        explicabo.</Timeline.Item>
                      <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
                      <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                      <Timeline.Item dot={<Icon type="clock-circle-o" style={{fontSize: '16px'}}/>}>Technical testing
                        2015-09-01</Timeline.Item>
                    </Timeline>
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

export default connect(({state_index}) => {
  console.log('state_index', state_index)
  return {
    state_index
  }
})(Index)
