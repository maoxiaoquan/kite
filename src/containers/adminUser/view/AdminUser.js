import React from 'react'
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Divider, Icon, Table, Button } from 'antd'
import { Link } from 'react-router-dom'

import './AdminUser.scss'
import { get_admin_user } from '../actions/AdminUserAction'
import admin_user from '../reducer/AdminUserReducer'

const {SubMenu} = Menu
const {Header, Content, Sider} = Layout

class AdminUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'id',
          dataIndex: 'uid',
          key: 'uid'
        },
        {
          title: '账户',
          dataIndex: 'account',
          key: 'account'
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '角色组',
          dataIndex: 'rule_name',
          key: 'rule_name'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '手机',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '注册时间',
          dataIndex: 'reg_time',
          key: 'reg_time'
        },
        {
          title: '最后登陆时间',
          dataIndex: 'last_sign_time',
          key: 'last_sign_time'
        },
        {
          title: '注册ip',
          dataIndex: 'reg_ip',
          key: 'reg_ip'
        },
        {
          title: '最后登陆op',
          dataIndex: 'last_sign_ip',
          key: 'last_sign_ip'
        },
        {
          title: '是否可以登陆',
          dataIndex: 'enable',
          key: 'enable'
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => {
            return (
              <div>
                <a href="javascript:;">Action 一 {record.name}</a>
                <a href="javascript:;">Delete</a>
                <a className="ant-dropdown-link" href="javascript:;">More actions <Icon type="down"/></a>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false
    }
  }

  componentDidMount () {
    this.props.dispatch(get_admin_user({}, (res) => {
      let pagination = {...this.state.pagination}
      pagination.total = res.count
      this.setState({
        pagination
      })
    }))
  }

  handleTableChange (pages, filters, sorter) {
    const that = this
    this.setState({loading: true})
    this.props.dispatch(get_admin_user({params: {page: pages.current, pageSize: 10}}, (res) => {
     let pagination = {...that.state.pagination}
       pagination.total = res.count
       pagination.current = pages.current
       that.setState({
         loading: false,
         pagination
       })
    }))
  }

  render () {
    const {admin_user} = this.props
    const {loading} = this.state
    return (
      <div className="box-card">
        <div className="box-card-header">
          <h2><strong>管理员管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <div className="admin-user">
            <Button className="admin-user-create-btn" icon="plus" type="primary">创建管理员</Button>
            {/*<p>{this.props.match.url}</p>
          <p>{this.props.match.params.id}</p>*/}
            <Table
              columns={this.state.columns}
              dataSource={admin_user.admin_user_list}
              loading={loading}
              onChange={this.handleTableChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="uid"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({admin_user}) => {
  return {
    admin_user
  }
})(AdminUser)

