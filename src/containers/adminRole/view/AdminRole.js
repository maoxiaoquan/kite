import React from 'react'
import { connect } from 'react-redux'
import { Icon, Table, Button, Modal } from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import './AdminRole.scss'
import { create_admin_role, get_admin_role_list } from '../actions/adminRoleAction'
import admin_user from '../reducer/adminRoleReducers'

class AdminRole extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '角色id',
          dataIndex: 'role_id',
          key: 'role_id'
        },
        {
          title: '角色名字',
          dataIndex: 'role_name',
          key: 'role_name'
        },
        {
          title: '角色描述',
          dataIndex: 'role_description',
          key: 'role_description'
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
      loading: false,
      visible: false,
      role_name: '',
      role_description: ''
    }
  }

  componentDidMount () {
    this.fetch_admin_role_list()
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }
  handleOk = () => {
    let params = {
      role_name: this.state.role_name,
      role_description: this.state.role_description
    }
    this.setState({
      visible: false
    })
    this.props.dispatch(create_admin_role(params, () => {
      alert.message_success('角色创建成功')
      this.fetch_admin_role_list()
    }))
  }
  handleCancel = (e) => {
    console.log(e)
    this.setState({
      visible: false
    })
  }

  handleTableChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })

    this.fetch_admin_role_list()
  }

  fetch_admin_role_list = () => {
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_admin_role_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  getRoleName = (event) => {
    this.setState({role_name: event.target.value})
  }
  getRoleDescription = (event) => {
    this.setState({role_description: event.target.value})
  }

  render () {
    const {admin_role} = this.props
    const {loading, role_name, role_description} = this.state
    return (
      <div className="box-card">
        <div className="box-card-header">
          <h2><strong>角色管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <div className="admin-role">
            <Button className="admin-role-create-btn" icon="plus" onClick={this.showModal} type="primary">创建角色</Button>
            <Modal
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              title="创建角色"
              visible={this.state.visible}
            >
              <div className="form-group">
                <label className="mr-bm-10" htmlFor="">角色名：</label>
                <input className="input-view" onChange={this.getRoleName} type="text" value={role_name}/>
              </div>
              <div className="form-group">
                <label className="mr-bm-10" htmlFor="">角色描述：</label>
                <input className="input-view" onChange={this.getRoleDescription} type="text" value={role_description}/>
              </div>
            </Modal>
            {/*<p>{this.props.match.url}</p>
          <p>{this.props.match.params.id}</p>*/}
            <Table
              columns={this.state.columns}
              dataSource={admin_role.admin_role_list}
              loading={loading}
              onChange={this.handleTableChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="role_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({admin_role}) => {
  return {
    admin_role
  }
})(AdminRole)

