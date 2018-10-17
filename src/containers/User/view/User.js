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

import {
  get_user_tag_all
} from '../../UserTag/actions/UserTagAction'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

class User extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
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
          title: '拥有的角色标签',
          dataIndex: 'user_tag_ids',
          key: 'user_tag_ids',
          render: (value, record) => {
            return (
              <div className="table-article-tag-view">
                {
                  this.state.user_tag_all.map((item, key) => {
                    let tags = record.user_tag_ids.split(',')
                    return tags.map((child_item, child_key) => {
                      if (item.user_tag_id === Number(child_item)) {
                        return (
                          <Tag className="table-article-tag-list" key={child_key} color="purple">{item.user_tag_name}</Tag>
                        )
                      }
                    })
                  })
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
                  value ? (<Icon type="check-circle"/>) : (<Icon type="close-circle"/>)
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
      loading: false,
      user_tag_all: []
    }
  }

  componentDidMount () {
    this.fetch_user_list()
    this.fetch_user_tag_all()
  }

  editUser (val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({type: 'SET_CURRENT_USER_INFO', data: val})
    this.props.form.setFieldsValue({
      nickname: val.nickname,
      user_tag_ids: val.user_tag_ids ? val.user_tag_ids.split(',') : [],
      enable: val.enable
    })
  }

  deleteUser (val) {
    this.props.dispatch({type: 'SET_CURRENT_USER_INFO', data: val})
    confirm({
      title: '确认要删除此用户吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_user_delete({uid: this.props.state_user.current_user_info.uid})
        /*删除用户*/
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  async TablePageChange (pages) {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_user_list(pages)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetch_user_edit(values)
      }
    })
  }

  fetch_user_tag_all () {
    this.props.dispatch(get_user_tag_all('', (res) => {
      this.setState({
        user_tag_all: res.user_tag_all
      })
    }))
  }

  fetch_user_delete (values) { /*删除用户*/
    this.props.dispatch(delete_user(values, (res) => {
      alert.message_success('删除用户成功')
      this.fetch_user_list()
    }))
  }

  fetch_user_list () {  /*获取用户带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_user_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  fetch_user_edit = (values) => { /*修改用户*/
    this.props.dispatch(edit_user({uid: this.props.state_user.current_user_info.uid, ...values}, (res) => {
      alert.message_success('修改用户成功')
      this.fetch_user_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  render () {
    const {loading} = this.state
    const {state_user = {}} = this.props
    const {getFieldDecorator} = this.props.form

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86'
    })(
      <Select style={{width: 70}}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    )

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 19}
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
                <Icon type="ellipsis"/>
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
                onSubmit={this.handleSubmit.bind(this)}
              >


                <FormItem
                  {...formItemLayout}
                  label="昵称"
                >
                  {getFieldDecorator('nickname', {
                    rules: [{required: true, message: '请输入昵称！', whitespace: true}]
                  })(
                    <Input placeholder="昵称"/>
                  )}
                </FormItem>


                <FormItem
                  {...formItemLayout}
                  label="用户角色标签"
                >
                  {getFieldDecorator('user_tag_ids', {
                    rules: [
                      {required: false, message: '请选择文章专栏下属专题!', type: 'array'}
                    ]
                  })(
                    <Select mode="multiple" placeholder="请选择文章专栏下属专题">
                      {
                        this.state.user_tag_all.map((item) =>
                          <Option key={item.user_tag_id}>{item.user_tag_name}</Option>)
                      }
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  label="是否可登录"
                >
                  {getFieldDecorator('enable', {valuePropName: 'checked'})(
                    <Switch/>
                  )}
                </FormItem>

                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button
                    className="register-btn"
                    htmlType="submit"
                    type="primary"
                  >确定</Button>
                </FormItem>
              </Form>
            </Modal>


            <Table
              columns={this.state.columns}
              dataSource={state_user.user_list}
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

export default connect(({state_user}) => {
  return {
    state_user
  }
})(UserForm)

