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

import './User.scss'
import {
  get_user_list,
  edit_user,
  delete_user
} from '../actions/UserAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

class User extends React.Component {
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
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email'
        },
        {
          title: '手机',
          dataIndex: 'phone',
          key: 'phone',
          render: (value, record) => {
            return (
              <div>
                {
                  value ? value : '无'
                }
              </div>
            )
          }
        },
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
              </div>
            )
          }
        }],
      pagination: {},
      modal_visible_edit: false,
      loading: false
    }
  }

  componentDidMount() {
    this.fetch_user_list()
  }

  editUser(val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({ type: 'SET_CURRENT_USER_INFO', data: val })
    this.props.form.setFieldsValue({
      nickname: val.nickname,
      enable: val.enable,
      password: '',
      confirm: ''
    })
  }

  deleteUser(val) {
    this.props.dispatch({ type: 'SET_CURRENT_USER_INFO', data: val })
    confirm({
      title: '确认要删除此用户吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_user_delete({ uid: this.props.user.current_user_info.uid })
        /*删除管理员用户*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  TablePageChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_user_list(pages)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetch_user_edit(values)
      }
    })
  }

  fetch_user_delete = (values) => { /*删除管理员用户*/
    this.props.dispatch(delete_user(values, (res) => {
      alert.message_success('删除用户成功')
      this.fetch_user_list()
    }))
  }

  fetch_user_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const { pagination: { current } } = this.state
    this.props.dispatch(get_user_list({ params: { page: current } }, (res) => {
      let pagination = { ...that.state.pagination }
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  fetch_user_edit = (values) => { /*修改管理员用户账户*/
    this.props.dispatch(edit_user({ uid: this.props.user.current_user_info.uid, ...values }, (res) => {
      alert.message_success('修改用户成功')
      this.fetch_user_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  render() {
    const { loading } = this.state
    const { user = {} } = this.props
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
          <h2><strong>用户管理</strong></h2>
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

            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_edit: false
                })
              }}
              title="修改用户"
              visible={this.state.modal_visible_edit}
            >
              <Form
                className="from-view"
                onSubmit={this.handleSubmit}
              >


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
                  >更新</Button>
                </FormItem>
              </Form>
            </Modal>



            <Table
              columns={this.state.columns}
              dataSource={user.user_list}
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

const UserForm = Form.create()(User)

export default connect(({ user }) => {
  return {
    user
  }
})(UserForm)

