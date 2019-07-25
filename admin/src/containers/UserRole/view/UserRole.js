import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Table,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Tag,
  Tree
} from 'antd'
import { Link } from 'react-router-dom'

import './UserRole.scss'
import {
  getUserRoleList,
  createUserRole,
  updateUserRole,
  deleteUserRole
} from '../actions/UserRoleAction'
import alert from '../../../utils/alert'
import { getUserAuthorityList } from '../../UserAuthority/action/UserAuthorityAction'
import { setUserRoleAuthority } from '../actions/UserRoleAction'

const TreeNode = Tree.TreeNode
const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class UserRole extends React.Component {
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
          title: '角色名',
          dataIndex: 'user_role_name',
          key: 'user_role_name',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">
              {record.user_role_name}
            </Tag>
          )
        },
        {
          title: '角色图标',
          dataIndex: 'user_role_icon',
          key: 'user_role_icon'
        },
        {
          title: '角色类型',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">
              {this.state.user_role_type_list[record.user_role_type]}
            </Tag>
          )
        },
        {
          title: '角色介绍',
          dataIndex: 'user_role_description',
          key: 'user_role_description'
        },
        {
          title: '角色图标演示',
          dataIndex: 'user_role_icon',
          key: 'user_role_icon_demo',
          render: (value, record) => {
            return (
              <div className="type">
                <img
                  className="tag-img-icon"
                  src={record.user_role_icon}
                  alt=""
                />
              </div>
            )
          }
        },
        {
          title: '是否在个人中心显示',
          dataIndex: 'is_show',
          key: 'is_show',
          render: (value, record) => {
            return (
              <div className="table-enable">
                {value ? (
                  <Icon type="check-circle" />
                ) : (
                  <Icon type="close-circle" />
                )}
              </div>
            )
          }
        },
        {
          title: '是否可以用',
          dataIndex: 'enable',
          key: 'enable',
          render: (value, record) => {
            return (
              <div className="table-enable">
                {value ? (
                  <Icon type="check-circle" />
                ) : (
                  <Icon type="close-circle" />
                )}
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table--btn">
                <Button
                  onClick={() => {
                    this._edit(record)
                  }}
                  size="small"
                  type="primary"
                >
                  修改
                </Button>

                <Button
                  className="box-btn-red"
                  onClick={() => {
                    this._delete(record)
                  }}
                  size="small"
                >
                  删除
                </Button>

                {record.user_role_type !== 2 ? (
                  <Button
                    className="box-btn-orange"
                    onClick={async () => {
                      this.setState({
                        visible_set_authority_modal: true,
                        role_authority_list: this.init_tree_data(
                          record.user_authority_ids
                            ? record.user_authority_ids.split(',')
                            : ''
                        )
                      })
                      await this.props.dispatch({
                        type: 'SET_CURRENT_USER_ROLE_INFO',
                        data: record
                      })
                    }}
                    size="small"
                  >
                    设置权限
                  </Button>
                ) : (
                  ''
                )}
              </div>
            )
          }
        }
      ],
      pagination: {
        current: 1
      },
      loading: false,
      confirmDirty: false,
      modal_visible_edit: false,
      modal_visible_authority: false,
      is_create: true,
      user_role_type_list: ['', '默认角色', '定制化角色'],
      menu_text: ['', '图片', '字体图标'],
      visible_create_role_modal: false,
      visible_set_authority_modal: false,
      role_authority_list: []
    }
  }

  componentDidMount() {
    this.fetchUserRoleList()
    /*获取后台权限所有*/
    this.props.dispatch(getUserAuthorityList())
  }

  _edit = data => {
    /*修改角色*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({
      type: 'SET_USER_ROLE_INFO',
      data: data
    })
    this.props.form.setFieldsValue({
      ...data
    })
  }

  init_tree_data = val => {
    /* 初始化选中树 */
    let tree_arr = []
    const { user_authority_source_list } = this.props.stateUserAuthority
    user_authority_source_list.map(item => {
      if (
        Number(item.authority_type) === 2 &&
        val.indexOf(item.authority_id) !== -1
      ) {
        tree_arr.push(item.authority_id)
      }
    })
    return tree_arr
  }

  _delete = value => {
    this.props.dispatch({
      type: 'SET_USER_ROLE_INFO',
      data: value
    })
    confirm({
      title: '确认要删除此角色吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchDeleteUserRole({
          user_role_id: this.props.stateUserRole.current_info.user_role_id
        })
        /*删除角色*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  TablePageChange = async pages => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetchUserRoleList(pages)
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modal_visible_edit: true,
      is_create: true
    })
    /*this.props.form.setFieldsValue({
      authority_parent_title: '11'
    })*/
  }

  handleSubmit = e => {
    e.preventDefault()
    const { is_create } = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (is_create) {
          this.fetchCreateUserRole(values)
        } else {
          this.fetchUpdateUserRole(values)
        }
      }
    })
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  selectRole = value => {
    this.setState({
      role_id: value
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  fetchCreateUserRole = values => {
    /*创建角色*/
    this.props.dispatch(
      createUserRole(values, res => {
        alert.message_success('创建角色成功')
        this.fetchUserRoleList()
        this.setState({
          modal_visible_edit: false
        })
      })
    )
  }

  fetchUpdateUserRole = values => {
    /*修改角色*/
    this.props.dispatch(
      updateUserRole(
        {
          user_role_id: this.props.stateUserRole.current_info.user_role_id,
          ...values
        },
        res => {
          alert.message_success('修改角色成功')
          this.fetchUserRoleList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  fetchDeleteUserRole = values => {
    /*删除管理员用户*/
    this.props.dispatch(
      deleteUserRole(values, res => {
        alert.message_success('删除角色成功')
        this.fetchUserRoleList()
      })
    )
  }

  fetchUserRoleList = () => {
    /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getUserRoleList({ params: { page: current } }, res => {
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

  fetch_set_user_role_authority = () => {
    /* 传递tyepe=2子节点 */
    const {
      current_role_info,
      role_authority_list_all
    } = this.props.stateUserRole
    this.props.dispatch(
      setUserRoleAuthority(
        {
          ...current_role_info,
          role_authority_list_all
        },
        () => {
          alert.message_success('角色权限设置成功')
          this.fetchUserRoleList()
          this.setState({
            visible_set_authority_modal: false
          })
        }
      )
    )
  }

  onCheck = (checkedKeys, event) => {
    this.setState({ role_authority_list: checkedKeys })
    this.props.dispatch({
      type: 'SET_USER_ROLE_AUTHORITY_LIST_ALL',
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
    const { stateUserRole, stateUserAuthority } = this.props
    const { loading, is_create, user_role_type_list } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
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
          offset: 5
        }
      }
    }

    return (
      <div className="layout-main">
        <div className="layout-main-title">
          <Icon type="user" /> <em>角色管理</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="article-tag-user-create-btn layout-btn"
            icon="plus"
            type="primary"
            onClick={() => this.showModal(0)}
          >
            创建用户角色
          </Button>
        </div>

        <div className="user-role">
          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="填写角色"
            visible={this.state.modal_visible_edit}
          >
            <Form className="from-view" onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="角色名">
                {getFieldDecorator('user_role_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入角色名！',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="角色名" />)}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="角色类型">
                {getFieldDecorator('user_role_type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择角色类型！'
                    }
                  ]
                })(
                  <Select placeholder="请选择角色类型！">
                    {user_role_type_list.map((item, key) => (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="角色名图标">
                {getFieldDecorator('user_role_icon', {
                  rules: [
                    {
                      message: '请输入角色名图标！',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="角色名图标" />)}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="角色描述">
                {getFieldDecorator('user_role_description', {
                  rules: [
                    {
                      required: true,
                      message: '请输入角色描述'
                    }
                  ]
                })(<TextArea placeholder="请输入角色描述" type="text" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="是否显示">
                {getFieldDecorator('is_show', { valuePropName: 'checked' })(
                  <Switch />
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否有效">
                {getFieldDecorator('enable', { valuePropName: 'checked' })(
                  <Switch />
                )}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                <Button
                  className="register-btn"
                  htmlType="submit"
                  type="primary"
                >
                  {is_create ? '创建角色' : '更新'}
                </Button>
              </FormItem>
            </Form>
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
              {this.renderTreeNodes(stateUserAuthority.user_authority_list)}
            </Tree>
            <div className="admin-role-foot">
              <Button
                icon="save"
                onClick={() => {
                  this.fetch_set_user_role_authority()
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
              dataSource={stateUserRole.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="user_role_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const UserTagForm = Form.create()(UserRole)

export default connect(({ stateUserRole, stateUserAuthority }) => {
  return {
    stateUserRole,
    stateUserAuthority
  }
})(UserTagForm)
