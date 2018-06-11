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
  Tag
} from 'antd'
import { Link } from 'react-router-dom'

import './AdminUser.scss'
import {
  get_admin_user_list,
  create_admin_user,
  edit_admin_user,
  delete_admin_user,
  get_admin_role_all,
  create_admin_user_role,
  get_admin_user_role_all,
  delete_admin_user_role
} from '../actions/AdminUserAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

class AdminUser extends React.Component {
  constructor(props) {
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
          key: 'rule_name',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                {/* <Tag color="orange">超级管理员</Tag>*/}
                {this.current_user_role(record) ? (
                  <Tag color="orange">{this.current_user_role(record).role_name}</Tag>) : (
                    <Tag color="#666">无</Tag>)}
              </div>
            )
          }
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
        /*{
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
          title: '最后登陆ip',
          dataIndex: 'last_sign_ip',
          key: 'last_sign_ip'
        },*/
        {
          title: '是否可以登陆',
          dataIndex: 'enable',
          key: 'enable',
          render: (value, record) => {
            return (
              <div className="table-is-login">
                {
                  value ? (<Icon type="check-circle" />) : (<Icon type="close-circle" />)
                }
              </div>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                <Button onClick={() => { this.editUser(record) }} size="small"
                  type="primary"
                >修改</Button>
                <Button className="box-btn-red"
                  onClick={() => {
                    this.deleteUser(record)
                  }}
                  size="small"
                >删除</Button>
                <Button className="box-btn-orange"
                  onClick={async () => {
                    await this.props.dispatch({ type: 'SET_ADMIN_CURRENT_USER_INFO', data: record })
                    this.setState({
                      modal_visible_authority: true
                    })
                  }} size="small">设置角色</Button>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false,
      confirmDirty: false,
      modal_visible_register: false,
      modal_visible_authority: false,
      is_create: true,
      role_id: ''
    }
  }

  componentDidMount() {
    this.initAdminUserPage()
  }

  async initAdminUserPage() {/*初始化获取所有列表*/
    await this.fetch_admin_user_list()
    /*管理员用户列表*/
    await this.props.dispatch(get_admin_role_all())
    /*所有角色列表*/
    await this.props.dispatch(get_admin_user_role_all())
    /*所有管理员用户与角色关联列表*/
  }

  editUser = (data) => {/*修改用户*/
    this.setState({
      modal_visible_register: true,
      is_create: false
    })
    this.props.dispatch({ type: 'SET_ADMIN_CURRENT_USER_INFO', data: data })
    this.props.form.setFieldsValue({
      account: data.account,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      enable: data.enable,
      password: '',
      confirm: ''
    })
  }

  deleteUser = (value) => {
    this.props.dispatch({ type: 'SET_ADMIN_CURRENT_USER_INFO', data: value })
    confirm({
      title: '确认要删除此用户吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_admin_user_delete({ uid: this.props.admin_user.current_user_info.uid })
        /*删除管理员用户*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  current_user_role = (value) => {  /*获取当前管理员用户的角色*/
    const { admin_user } = this.props
    const { current_user_info, admin_user_role_all, admin_role_all } = admin_user

    let curr_info = value || current_user_info

    let curr_user_role = ''
    let curr_role = ''
    admin_user_role_all.map(item => {
      if (item.uid === curr_info.uid) {
        curr_user_role = item
      }
    })

    admin_role_all.map(item => {
      if (item.role_id === curr_user_role.role_id) {
        curr_role = item
      }
    })

    return curr_role
  }

  TablePageChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_admin_user_list(pages)
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modal_visible_register: true,
      is_create: true
    })
    /*this.props.form.setFieldsValue({
      authority_parent_title: '11'
    })*/
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { is_create } = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (is_create) {
          this.fetch_admin_user_create(values)
        } else {
          this.fetch_admin_user_edit(values)
        }
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！')
    } else {
      callback()
    }
  }

  selectRole = (value) => {
    this.setState({
      role_id: value
    })
  }
  handleSubmitAuthority = () => {
    if (this.state.role_id) {
      this.props.dispatch(create_admin_user_role({
        /*创建管理员用户角色*/
        role_id: this.state.role_id,
        uid: this.props.admin_user.current_user_info.uid
      }, () => {
        this.setState({
          modal_visible_authority: false
        })
        this.initAdminUserPage()
        alert.message_success('角色更新成功')
      }))
    } else {
      alert.message_error('请选择角色类型')
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  fetch_admin_user_create = (values) => {  /*创建管理员用户*/
    this.props.dispatch(create_admin_user(values, (res) => {
      alert.message_success('创建成功')
      this.fetch_admin_user_list()
      this.setState({
        modal_visible_register: false
      })
    }))
  }

  fetch_admin_user_edit = (values) => { /*修改管理员用户账户*/
    this.props.dispatch(edit_admin_user({ uid: this.props.admin_user.current_user_info.uid, ...values }, (res) => {
      alert.message_success('修改用户成功')
      this.fetch_admin_user_list()
      this.setState({
        modal_visible_register: false
      })
    }))
  }

  fetch_admin_user_delete = (values) => { /*删除管理员用户*/
    this.props.dispatch(delete_admin_user(values, (res) => {
      alert.message_success('删除用户成功')
      this.fetch_admin_user_list()
    }))
  }

  fetch_admin_user_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const { pagination: { current } } = this.state
    this.props.dispatch(get_admin_user_list({ params: { page: current } }, (res) => {
      let pagination = { ...that.state.pagination }
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  render() {
    const { admin_user } = this.props
    const { admin_role_all = [] } = admin_user
    const { loading, is_create } = this.state
    const { getFieldDecorator } = this.props.form

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86'
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    )

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
      <div className="box-card">
        <div className="box-card-header">
          <h2><strong>管理员管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis" />
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <div className="admin-user">
            <Button
              className="admin-user-create-btn"
              icon="plus" type="primary"
              onClick={() => this.showModal(0)}
            >创建管理员</Button>
            {/*<p>{this.props.match.url}</p>
          <p>{this.props.match.params.id}</p>*/}

            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_register: false
                })
              }}
              title="填写管理用户"
              visible={this.state.modal_visible_register}
            >
              <Form
                className="from-view"
                onSubmit={this.handleSubmit}
              >

                <FormItem
                  {...formItemLayout}
                  label="账户"
                >
                  {getFieldDecorator('account', {
                    rules: [{ required: true, message: '请输入账户！', whitespace: true }]
                  })(
                    <Input placeholder="账户" />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="昵称"
                >
                  {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: '请输入昵称！', whitespace: true }]
                  })(
                    <Input placeholder="昵称" />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="密码"
                >
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '请输入密码！'
                    }, {
                      validator: this.validateToNextPassword
                    }]
                  })(
                    <Input placeholder="密码"
                      type="password"
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="重复密码"
                >
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: true, message: '重复输入密码！'
                    }, {
                      validator: this.compareToFirstPassword
                    }]
                  })(
                    <Input onBlur={this.handleConfirmBlur}
                      placeholder="重复密码"
                      type="password"
                    />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="电子邮件"
                >
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: '输入的电子邮件无效！'
                    }, {
                      required: true, message: '请输入您的电子邮件！'
                    }]
                  })(
                    <Input placeholder="邮箱" />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="手机号码"
                >
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入你的手机号码！' }]
                  })(
                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="是否有效"
                >
                  {getFieldDecorator('enable', { valuePropName: 'checked' })(
                    <Switch />
                  )}
                </FormItem>

                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button
                    className="register-btn"
                    htmlType="submit"
                    type="primary"
                  >
                    {
                      is_create ? '创建账户' : '更新'
                    }
                  </Button>
                </FormItem>
              </Form>
            </Modal>


            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_authority: false
                })
              }}
              title="修改用户权限"
              visible={this.state.modal_visible_authority}
            >
              <FormItem
                {...formItemLayout}
                label="管理员账户"
              >
                <Input disabled={true} type="text" value={admin_user.current_user_info.account} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="角色类型"
              >
                <Select placeholder="请设置权限" style={{ width: 150 }} onChange={this.selectRole}>
                  {
                    admin_role_all.map(item => <Option key={item.role_id}>{item.role_name}</Option>)
                  }
                </Select>
              </FormItem>
              <FormItem
                {...tailFormItemLayout}
              >
                <Button
                  className="register-btn"
                  type="primary"
                  onClick={this.handleSubmitAuthority}
                >
                  修改权限
                </Button>
              </FormItem>
            </Modal>

            <Table
              columns={this.state.columns}
              dataSource={admin_user.admin_user_list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="uid"
            />
          </div>
        </div>
      </div>
    )
  }
}

const AdminUserForm = Form.create()(AdminUser)

export default connect(({ admin_user }) => {
  return {
    admin_user
  }
})(AdminUserForm)

