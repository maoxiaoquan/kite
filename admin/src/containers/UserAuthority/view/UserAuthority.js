import React from 'react'
import { connect } from 'react-redux'
import {
  Form,
  Icon,
  Input,
  Button,
  Select,
  Modal,
  InputNumber,
  Tree,
  Switch
} from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import { isEmpty } from '../../../utils/tools'
import './UserAuthority.scss'
import {
  createUserAuthority,
  getUserAuthorityList,
  deleteUserAuthority,
  updateUserAuthority
} from '../action/UserAuthorityAction'

const TreeNode = Tree.TreeNode
const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm

class UserAuthority extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      authority_type_select: 1,
      authority_parent_id: '',
      authority_parent_name: '',
      is_create: true,
      menu_text: ['', '基础菜单', '操作和功能']
    }
  }

  componentDidMount() {
    this.fetch_user_authority_list()
  }

  showCreateModal = async value => {
    this.props.form.resetFields()
    this.setState({
      visible: true,
      authority_parent_id: value ? value.authority_id : '',
      authority_parent_name: value ? value.authority_name : ''
    })
    if (!value) {
      this.props.form.setFields({
        authority_sort: {
          value: await this.props.state_user_authority.user_authority_list
            .length
        }
      })
    } else {
      this.props.form.setFields({
        authority_sort: {
          value: value.children.length
        }
      })
    }
  }

  showEditModal = value => {
    this.setState({
      visible: true,
      authority_parent_id: value ? value.authority_parent_id : '',
      authority_parent_name: value ? value.authority_parent_name : '',
      authority_type_select: value.authority_type
    })
    this.props.form.setFieldsValue({
      authority_name: value.authority_name,
      authority_type: value.authority_type,
      authority_url: value.authority_url,
      authority_sort: value.authority_sort,
      authority_description: value.authority_description,
      enable: value.enable || 0
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  authority_type_Change = value => {
    this.setState({
      authority_type_select: value
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        if (this.state.is_create) {
          await this.fetch_user_authority_create(values)
        } else {
          await this.fetch_user_authority_update(values)
        }
      }
    })
  }

  handle_delete_authority = data => {
    const that = this
    confirm({
      title: '你确认要删除当前权限吗',
      content: `${
        data.authority_name
      }，删除权限后，所有与之关联的角色将失去此权限！`,
      okText: 'YES',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        that.fetch_user_authority_delete(data)
      },
      onCancel() {}
    })
  }

  fetch_user_authority_list = () => {
    this.props.dispatch(getUserAuthorityList())
  }

  fetch_user_authority_create = async values => {
    /* 创建权限 */
    await this.props.dispatch(
      createUserAuthority(
        {
          authority_name: values.authority_name,
          authority_type: values.authority_type,
          authority_parent_id: this.state.authority_parent_id,
          authority_parent_name: this.state.authority_parent_name,
          authority_url: values.authority_url,
          authority_sort: values.authority_sort,
          authority_description: values.authority_description,
          enable: values.enable || 0
        },
        () => {
          this.setState({
            visible: false
          })
          this.fetch_user_authority_list()
          alert.message_success('权限创建成功')
        }
      )
    )
  }

  fetch_user_authority_update = async values => {
    /* 更新权限 */
    await this.props.dispatch(
      updateUserAuthority(
        {
          authority_id: this.props.state_user_authority.current_authority_info
            .authority_id,
          authority_name: values.authority_name,
          authority_type: values.authority_type,
          authority_url: values.authority_url,
          authority_sort: values.authority_sort,
          authority_description: values.authority_description,
          enable: values.enable || 0
        },
        () => {
          this.setState({
            visible: false
          })
          this.fetch_user_authority_list()
          alert.message_success('权限更新成功')
        }
      )
    )
  }

  fetch_user_authority_delete = async data => {
    /* 删除权限 */
    let id_arr = await this.traversal_delete(data)
    this.props.dispatch(
      deleteUserAuthority({ authority_id_arr: id_arr }, () => {
        this.fetch_user_authority_list()
        alert.message_success('删除成功')
      })
    )
  }

  traversal_delete = val => {
    let _arr = []

    function id_arr(data) {
      for (let i in data) {
        _arr.push(data[i].authority_id)
        if (!isEmpty(data[i].children)) {
          id_arr(data[i].children)
        }
      }
    }

    _arr.push(val.authority_id)
    if (!isEmpty(val.children)) {
      id_arr(val.children)
    }
    return _arr
  }

  render() {
    const { state_user_authority } = this.props
    const { getFieldDecorator } = this.props.form
    const { authority_type_select, authority_parent_name } = this.state

    const customLabel = data => {
      return (
        <div className="box-tree-title clearfix">
          <div className="pull-left">
            <span className="title">{data.authority_name} </span>
          </div>
          <div className="pull-right">
            <Icon
              onClick={() => {
                this.showCreateModal(data)
                this.setState({
                  is_create: true
                })
              }}
              type="plus-circle-o"
            />
            <Icon
              onClick={() => {
                this.showEditModal(data)
                this.setState({
                  is_create: false
                })
                this.props.dispatch({
                  type: 'SET_CURRENT_USER_AUTHORITY_INFO',
                  data: data
                })
              }}
              type="edit"
            />
            <Icon
              onClick={() => this.handle_delete_authority(data)}
              type="delete"
            />
          </div>
        </div>
      )
    }

    const TreeNodeTree = data => {
      return data.length > 0
        ? data.map(item => {
            return (
              <TreeNode key={item.authority_id} title={customLabel(item)}>
                {TreeNodeTree(item.children)}
              </TreeNode>
            )
          })
        : null
    }

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
          <Icon type="setting" /> <em>权限菜单</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="admin-authority-create-btn layout-btn"
            icon="plus"
            onClick={() => this.showCreateModal()}
            type="primary"
          >
            创建权限
          </Button>
        </div>

        <div className="admin-authority">
          <Modal
            footer={null}
            onCancel={this.handleCancel}
            title="权限"
            visible={this.state.visible}
          >
            <Form className="login-form" onSubmit={this.handleSubmit}>
              {authority_parent_name ? (
                <FormItem {...formItemLayout} label="父权限名称">
                  <Input
                    disabled={true}
                    type="text"
                    value={this.state.authority_parent_name}
                  />
                </FormItem>
              ) : (
                ''
              )}

              <FormItem {...formItemLayout} hasFeedback label="权限名称">
                {getFieldDecorator('authority_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入权限名称'
                    }
                  ]
                })(<Input type="text" />)}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="权限类型">
                {getFieldDecorator('authority_type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择权限类型！'
                    }
                  ]
                })(
                  <Select
                    onChange={this.authority_type_Change}
                    placeholder="请选择权限类型！"
                  >
                    <Option value="1">基础菜单</Option>
                    <Option value="2">操作和功能</Option>
                  </Select>
                )}
              </FormItem>

              {Number(authority_type_select) === 2 ? (
                <FormItem {...formItemLayout} hasFeedback label="权限路径">
                  {getFieldDecorator('authority_url', {
                    rules: [
                      {
                        required: true,
                        message: '请输入权限路径'
                      }
                    ]
                  })(
                    <Input
                      addonBefore="/api-client/v1"
                      placeholder="请输入权限路径"
                      type="text"
                    />
                  )}
                </FormItem>
              ) : (
                <FormItem {...formItemLayout} hasFeedback label="权限Key">
                  {getFieldDecorator('authority_url', {
                    rules: [
                      {
                        required: true,
                        message: '请输入权限Key'
                      }
                    ]
                  })(<Input placeholder="请输入权限Key" type="text" />)}
                </FormItem>
              )}

              <FormItem {...formItemLayout} label="排序">
                {getFieldDecorator('authority_sort')(<InputNumber />)}
              </FormItem>
              <FormItem {...formItemLayout} hasFeedback label="权限描述">
                {getFieldDecorator('authority_description', {
                  rules: [
                    {
                      required: true,
                      message: '请输入权限描述'
                    }
                  ]
                })(<Input placeholder="请输入权限描述" type="text" />)}
              </FormItem>

              {Number(authority_type_select) !== 2 ? (
                <FormItem {...formItemLayout} label="是否显示">
                  {getFieldDecorator('enable', { valuePropName: 'checked' })(
                    <Switch />
                  )}
                </FormItem>
              ) : (
                ''
              )}
              <FormItem {...tailFormItemLayout}>
                <Button
                  className="login-form-button"
                  htmlType="submit"
                  type="primary"
                >
                  {this.state.is_create ? '提交' : '修改'}
                </Button>
                <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>
                  重置
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <div className="layout-card-view">
            <Tree defaultExpandAll={true} showLine ref="tree">
              {state_user_authority.user_authority_list.map(item => {
                return (
                  <TreeNode key={item.authority_id} title={customLabel(item)}>
                    {TreeNodeTree(item.children)}
                  </TreeNode>
                )
              })}
            </Tree>
          </div>
        </div>
      </div>
    )
  }
}

const UserAuthorityForm = Form.create()(UserAuthority)

export default connect(({ state_user_authority }) => {
  return {
    state_user_authority
  }
})(UserAuthorityForm)
