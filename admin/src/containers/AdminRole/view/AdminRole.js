import React from 'react'
import { connect } from 'react-redux'
import { Icon, Table, Button, Modal, Form, Input, Select, Tree } from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import './AdminRole.scss'
import { get_admin_authority_list } from '../../AdminAuthority/action/AdminAuthorityAction'
import {
  create_admin_role,
  get_admin_role_list,
  edit_admin_role,
  set_admin_role_authority,
  delete_admin_role
} from '../actions/adminRoleAction'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm
const { TextArea } = Input

class AdminRole extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          render: (text, record, index) => (
            <span
              style={{
                width: '20px',
                display: 'block'
              }}
            >
              {Number((this.state.pagination.current - 1) * 10) + index + 1}
            </span>
          )
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
                <Button
                  onClick={async () => {
                    this.edit_role(record)
                    await this.props.dispatch({
                      type: 'SET_CURRENT_ADMIN_ROLE_INFO',
                      data: record
                    })
                  }}
                  size="small"
                  type="primary"
                >
                  修改
                </Button>

                <Button
                  className="box-btn-red"
                  onClick={async () => {
                    await this.props.dispatch({
                      type: 'SET_CURRENT_ADMIN_ROLE_INFO',
                      data: record
                    })
                    this.delete_role()
                  }}
                  size="small"
                >
                  删除
                </Button>

                <Button
                  className="box-btn-orange"
                  onClick={async () => {
                    this.setState({
                      visible_set_authority_modal: true,
                      role_authority_list: this.init_tree_data(
                        record.admin_authority_ids
                          ? record.admin_authority_ids.split(',')
                          : ''
                      )
                    })
                    await this.props.dispatch({
                      type: 'SET_CURRENT_ADMIN_ROLE_INFO',
                      data: record
                    })
                  }}
                  size="small"
                >
                  设置权限
                </Button>
              </div>
            )
          }
        }
      ],
      pagination: {
        current: 1
      },
      loading: false,
      visible_create_role_modal: false,
      visible_set_authority_modal: false,
      role_name: '',
      role_description: '',
      is_create: true,
      role_authority_list: []
    }
  }

  componentDidMount() {
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

  init_tree_data = val => {
    /* 初始化选中树 */
    let tree_arr = []
    const { admin_authority_source_list } = this.props.state_admin_authority
    admin_authority_source_list.map(item => {
      if (
        Number(item.authority_type) === 2 &&
        val.indexOf(item.authority_id) !== -1
      ) {
        tree_arr.push(item.authority_id)
      }
    })
    return tree_arr
  }

  init_role_from = () => {
    /*初始化角色表单*/
    this.setState({
      role_name: '',
      role_description: ''
    })
  }

  edit_role = val => {
    /*修改角色*/
    this.setState({
      visible_create_role_modal: true,
      is_create: false,
      role_name: val.role_name,
      role_description: val.role_description
    })
  }

  delete_role = () => {
    /* 删除角色 删除角色的同时要删除3张表之前的关联  用户角色表 角色表 角色权限表 */
    const { current_role_info } = this.props.state_admin_role
    confirm({
      title: '确认要删除当前角色吗?',
      content: '删除当前角色会删除角色用户关联，以及角色权限关联',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: async () => {
        await this.props.dispatch(
          delete_admin_role({ role_id: current_role_info.role_id }, res => {
            /*获取后台角色分页列表*/
            this.fetch_admin_role_list()
          })
        )
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  handleOk = () => {
    /*判断是修改还是创建*/
    if (this.state.is_create) {
      this.fetch_admin_create_role()
    } else {
      this.fetch_admin_edit_role()
    }
  }

  handleCancel = e => {
    this.setState({
      visible_create_role_modal: false
    })
  }

  handleTableChange = async pages => {
    /* 根据分页获取角色列表 */
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_admin_role_list()
  }

  fetch_admin_edit_role = () => {
    /*修改角色*/
    this.props.dispatch(
      edit_admin_role(
        {
          role_id: this.props.state_admin_role.current_role_info.role_id,
          role_name: this.state.role_name,
          role_description: this.state.role_description
        },
        () => {
          alert.message_success('修改角色成功')
          this.fetch_admin_role_list()
          this.setState({
            visible_create_role_modal: false
          })
        }
      )
    )
  }
  fetch_admin_create_role = () => {
    /*创建角色*/
    let params = {
      role_name: this.state.role_name,
      role_description: this.state.role_description
    }
    this.props.dispatch(
      create_admin_role(params, () => {
        alert.message_success('角色创建成功')
        this.fetch_admin_role_list()
        this.setState({
          visible_create_role_modal: false
        })
      })
    )
  }

  fetch_set_admin_role_authority = () => {
    /* 传递tyepe=2子节点 */
    const {
      current_role_info,
      role_authority_list_all
    } = this.props.state_admin_role
    this.props.dispatch(
      set_admin_role_authority(
        {
          ...current_role_info,
          role_authority_list_all
        },
        () => {
          alert.message_success('角色权限设置成功')
          this.fetch_admin_role_list()
          this.setState({
            visible_set_authority_modal: false
          })
        }
      )
    )
  }

  fetch_admin_role_list = () => {
    /*获取角色分页列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      get_admin_role_list({ params: { page: current } }, res => {
        let pagination = { ...that.state.pagination }
        pagination.total = res.count
        pagination.current = current
        that.setState({
          loading: false,
          pagination
        })
      })
    )
  }

  onCheck = (checkedKeys, event) => {
    this.setState({ role_authority_list: checkedKeys })
    this.props.dispatch({
      type: 'SET_ADMIN_ROLE_AUTHORITY_LIST_ALL',
      data: [...checkedKeys, ...event.halfCheckedKeys]
    })
  }

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children.length > 0) {
        return (
          <TreeNode
            dataRef={item}
            key={item.authority_id}
            title={item.authority_name}
            type={item.type}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.authority_id} title={item.authority_name} />
    })
  }

  render() {
    const { state_admin_role, state_admin_authority } = this.props
    const { loading, role_name, role_description, is_create } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
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
      <div className="layout-main">
        <div className="layout-main-title">
          <Icon type="setting" /> <em>角色管理</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="admin-role-create-btn layout-btn"
            icon="plus"
            onClick={this.showModal}
            type="primary"
          >
            创建角色
          </Button>
        </div>

        <div className="admin-role">
          <Modal
            footer={null}
            onCancel={this.handleCancel}
            title="创建角色"
            visible={this.state.visible_create_role_modal}
          >
            <FormItem {...formItemLayout} label="角色名">
              <Input
                className="input-view"
                onChange={e => {
                  this.setState({ role_name: e.target.value })
                }}
                placeholder="请填写角色名"
                value={role_name}
              />
            </FormItem>

            <FormItem {...formItemLayout} label="角色描述">
              <TextArea
                autosize={{ minRows: 2, maxRows: 6 }}
                onChange={e => {
                  this.setState({ role_description: e.target.value })
                }}
                placeholder="请填写角色描述"
                value={role_description}
              />
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button
                className="register-btn"
                htmlType="submit"
                onClick={this.handleOk}
                type="primary"
              >
                {is_create ? '创建' : '更新'}
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
              checkable
              checkedKeys={this.state.role_authority_list}
              onCheck={this.onCheck}
              defaultExpandAll={true}
              ref="tree"
              showLine
            >
              {this.renderTreeNodes(state_admin_authority.admin_authority_list)}
            </Tree>
            <div className="admin-role-foot">
              <Button
                icon="save"
                onClick={() => {
                  this.fetch_set_admin_role_authority()
                }}
                type="primary"
              >
                确定
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    visible_set_authority_modal: false
                  })
                }}
              >
                取消
              </Button>
            </div>
          </Modal>

          <div className="layout-table">
            <Table
              columns={this.state.columns}
              dataSource={state_admin_role.admin_role_list}
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

export default connect(({ state_admin_role, state_admin_authority }) => {
  return {
    state_admin_role,
    state_admin_authority
  }
})(AdminRole)
