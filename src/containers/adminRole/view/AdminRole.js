import React from 'react'
import { connect } from 'react-redux'
import { Icon, Table, Button, Modal, Form, Input, Checkbox, Select, InputNumber, Tree } from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import './AdminRole.scss'
import { get_admin_authority_list } from '../../adminAuthority/action/AdminAuthorityAction'
import {
  create_admin_role,
  get_admin_role_list,
  edit_admin_role,
  set_admin_role_authority
} from '../actions/adminRoleAction'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const {TextArea} = Input

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
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                <Button type="primary" size="small" onClick={async () => {
                  this.edit_role(record)
                  await this.props.dispatch({type: 'SET_CURRENT_ROLE_INFO', data: record})
                }}>修改</Button>
                <Button className="box-btn-red" size="small" onClick={async () => {
                  await this.props.dispatch({type: 'SET_CURRENT_ROLE_INFO', data: record})
                }}>删除</Button>
                <Button className="box-btn-orange" size="small" onClick={async () => {
                  this.setState({
                    visible_set_authority_modal: true
                  })
                  await this.props.dispatch({type: 'SET_CURRENT_ROLE_INFO', data: record})
                }}
                >设置权限</Button>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false,
      visible_create_role_modal: false,
      visible_set_authority_modal: false,
      role_name: '',
      role_description: '',
      is_create: true,
      role_authority_list: ['HyJQVFQg7', 'HJKe-Cmem'],
    }
  }

  componentDidMount () {
    /*获取后台角色分页列表*/
    this.fetch_admin_role_list()
    /*获取后台权限所有*/
    this.props.dispatch(get_admin_authority_list())
  }

  showModal = () => {
    this.setState({
      visible_create_role_modal: true,
      is_create: true
    })
    this.init_role_from()
  }

  init_role_from = () => { /*初始化角色表单*/
    this.setState({
      role_name: '',
      role_description: ''
    })
  }

  edit_role = (val) => {/*修改角色*/
    this.setState({
      visible_create_role_modal: true,
      is_create: false,
      role_name: val.role_name,
      role_description: val.role_description
    })
  }

  handleOk = () => { /*判断是修改还是创建*/
    if (this.state.is_create) {
      this.fetch_admin_create_role()
    } else {
      this.fetch_admin_edit_role()
    }
  }
  handleCancel = (e) => {
    this.setState({
      visible_create_role_modal: false
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

  fetch_admin_edit_role = () => { /*修改角色*/
    this.props.dispatch(edit_admin_role({
      role_id: this.props.admin_role.current_role_info.role_id,
      role_name: this.state.role_name,
      role_description: this.state.role_description
    }, () => {
      alert.message_success('修改角色成功')
      this.fetch_admin_role_list()
      this.setState({
        visible_create_role_modal: false
      })
    }))
  }
  fetch_admin_create_role = () => { /*创建角色*/
    let params = {
      role_name: this.state.role_name,
      role_description: this.state.role_description
    }
    this.props.dispatch(create_admin_role(params, () => {
      alert.message_success('角色创建成功')
      this.fetch_admin_role_list()
      this.setState({
        visible_create_role_modal: false
      })
    }))
  }

  fetch_set_admin_role_authority = () => {
    const {role_authority_list} = this.state
    this.prop.dispatch(set_admin_role_authority({role_authority_list}, () => {

    }))
  }

  fetch_admin_role_list = () => { /*获取角色分页列表*/
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

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys)
    this.setState({role_authority_list: checkedKeys})
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children.length > 0) {
        return (
          <TreeNode title={item.authority_name} key={item.authority_id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.authority_name} key={item.authority_id}/>
    })
  }

  render () {
    const {admin_role, admin_authority} = this.props
    const {loading, role_name, role_description, is_create} = this.state

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20}
      }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 4
        }
      }
    }
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
              footer={null}
              onCancel={this.handleCancel}
              title="创建角色"
              visible={this.state.visible_create_role_modal}
            >
              <FormItem
                {...formItemLayout}
                label="角色名"
              >
                <Input className="input-view"
                       onChange={(e) => {this.setState({role_name: e.target.value})}}
                       placeholder="请填写角色名" value={role_name}/>
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="角色描述"
              >
                <TextArea autosize={{minRows: 2, maxRows: 6}}
                          onChange={(e) => {this.setState({role_description: e.target.value})}}
                          placeholder="请填写角色描述"
                          value={role_description}/>
              </FormItem>

              <FormItem
                {...tailFormItemLayout}
              >
                <Button
                  className="register-btn"
                  htmlType="submit"
                  type="primary"
                  onClick={this.handleOk}
                >
                  {
                    is_create ? '创建' : '更新'
                  }
                </Button>
              </FormItem>
            </Modal>


            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  visible_set_authority_modal: false
                })
              }}
              title="设置权限"
              visible={this.state.visible_set_authority_modal}
            >
              <Tree
                showLine
                checkable
                onCheck={this.onCheck}
                checkedKeys={this.state.role_authority_list}
              >
                {this.renderTreeNodes(admin_authority.admin_authority_list)}
              </Tree>
              <div className="admin-role-foot">
                <Button type="primary" icon="save">确定</Button>
                <Button>取消</Button>
              </div>
            </Modal>

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

export default connect(({admin_role, admin_authority}) => {
  return {
    admin_role,
    admin_authority
  }
})(AdminRole)

