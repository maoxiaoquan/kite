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

import './User.scss'
import {
  getUserList,
  editUser,
  deleteUser,
  banUser
} from '../actions/UserAction'
import alert from '../../../utils/alert'

import { getUserRoleAll } from '../../UserRole/actions/UserRoleAction'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
import { compareAsc, format } from 'date-fns'
import { DatePicker } from 'antd'

const { MonthPicker, RangePicker } = DatePicker

class User extends React.Component {
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
          title: '昵称',
          dataIndex: 'nickname',
          key: 'nickname'
        },
        {
          title: '拥有的角色标签',
          dataIndex: 'user_role_ids',
          key: 'user_role_ids',
          render: (value, record) => {
            return (
              <div className="table-article-tag-view">
                {this.state.user_role_all.map((item, key) => {
                  let tags = record.user_role_ids
                    ? record.user_role_ids.split(',')
                    : []
                  return tags.map((child_item, child_key) => {
                    if (item.user_role_id === child_item) {
                      return (
                        <Tag
                          className="table-article-tag-list"
                          key={child_key}
                          color="purple"
                        >
                          {item.user_role_name}
                        </Tag>
                      )
                    }
                  })
                })}
              </div>
            )
          }
        },
        {
          title: '文章是否禁言中',
          dataIndex: 'ft_article_ban_dt',
          key: 'ft_article_ban_dt',
          render: (value, record) => {
            return (
              <div className="ban">
                <div>
                  文章是否被禁：
                  <Tag className="table-article-tag-list" color="orange">
                    {this.isBan(record.article_ban_dt) ? 'yes' : 'no'}
                  </Tag>
                </div>
                <div>
                  禁言到：
                  {record.ft_article_ban_dt}（
                  {this.isBan(record.article_ban_dt) ? '禁言中' : '已过期'}）
                </div>
              </div>
            )
          }
        },
        {
          title: '评论是否禁言中',
          dataIndex: 'ft_comment_ban_dt',
          key: 'ft_comment_ban_dt',
          render: (value, record) => {
            return (
              <div className="ban">
                <div>
                  评论是否被禁：
                  <Tag className="table-article-tag-list" color="orange">
                    {this.isBan(record.comment_ban_dt) ? 'yes' : 'no'}
                  </Tag>
                </div>
                <div>
                  禁言到：
                  {record.ft_comment_ban_dt}（
                  {this.isBan(record.comment_ban_dt) ? '禁言中' : '已过期'}）
                </div>
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
                    this.editUser(record)
                  }}
                  size="small"
                  type="primary"
                >
                  修改
                </Button>
                <Button
                  className="box-btn-red"
                  onClick={() => {
                    this.deleteUser(record)
                  }}
                  size="small"
                >
                  删除
                </Button>
                <Button
                  className="table--btn"
                  onClick={() => {
                    this.props.dispatch({
                      type: 'SET_CURRENT_USER_INFO',
                      data: record
                    })
                    this.setState({
                      isArticleBanVisible: true
                    })
                  }}
                  size="small"
                  type="primary"
                >
                  禁文章
                </Button>
                <Button
                  className="table--btn"
                  onClick={() => {
                    this.props.dispatch({
                      type: 'SET_CURRENT_USER_INFO',
                      data: record
                    })
                    this.setState({
                      isCommentBanVisible: true
                    })
                  }}
                  size="small"
                  type="primary"
                >
                  禁评论
                </Button>
              </div>
            )
          }
        }
      ],
      pagination: {
        current: 1
      },
      modal_visible_edit: false,
      isArticleBanVisible: false,
      isCommentBanVisible: false,
      articleBanDate: '',
      commentBanDate: '',
      loading: false,
      user_role_all: []
    }
  }

  componentDidMount() {
    this.fetch_user_list()
    this.fetch_user_role_all()
  }

  isBan(data) {
    let date = new Date()
    let currDate = format(date.setHours(date.getHours()), 'YYYY-MM-DD HH:mm:ss')
    if (new Date(currDate).getTime() > new Date(data).getTime()) {
      return false
    } else {
      return true
    }
  }

  editUser(val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({ type: 'SET_CURRENT_USER_INFO', data: val })
    this.props.form.setFieldsValue({
      nickname: val.nickname,
      user_role_ids: val.user_role_ids ? val.user_role_ids.split(',') : [],
      enable: val.enable
    })
  }

  banUser(val) {
    let params = {
      uid: this.props.state_user.current_user_info.uid
    }
    if (val.type === 'article') {
      params.article_ban_dt = this.state.articleBanDate
    } else {
      params.comment_ban_dt = this.state.commentBanDate
    }
    this.props.dispatch(
      banUser(params, result => {
        if (val.type === 'article') {
          this.setState({
            isArticleBanVisible: false
          })
        } else {
          this.setState({
            isCommentBanVisible: false
          })
        }
        this.fetch_user_list()
      })
    )
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
        this.fetch_user_delete({
          uid: this.props.state_user.current_user_info.uid
        })
        /*删除用户*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  async TablePageChange(pages) {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetch_user_list(pages)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetch_user_edit(values)
      }
    })
  }

  fetch_user_role_all() {
    this.props.dispatch(
      getUserRoleAll('', res => {
        this.setState({
          user_role_all: res.user_role_all ? res.user_role_all : []
        })
      })
    )
  }

  fetch_user_delete(values) {
    /*删除用户*/
    this.props.dispatch(
      deleteUser(values, res => {
        alert.message_success('删除用户成功')
        this.fetch_user_list()
      })
    )
  }

  fetch_user_list() {
    /*获取用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getUserList({ params: { page: current } }, res => {
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

  fetch_user_edit = values => {
    /*修改用户*/
    this.props.dispatch(
      editUser(
        { uid: this.props.state_user.current_user_info.uid, ...values },
        res => {
          alert.message_success('修改用户成功')
          this.fetch_user_list()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  render() {
    const { loading } = this.state
    const { state_user = {} } = this.props
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
      <div className="layout-main">
        <div className="layout-main-title">
          <Icon type="user" /> <em>用户管理</em>
        </div>

        <div className="layout-nav-btn" />

        <div className="admin-web-user">
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
            <Form className="from-view" onSubmit={this.handleSubmit.bind(this)}>
              <FormItem {...formItemLayout} label="昵称">
                {getFieldDecorator('nickname', {
                  rules: [
                    {
                      required: true,
                      message: '请输入昵称！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={true} placeholder="昵称" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="用户角色标签">
                {getFieldDecorator('user_role_ids', {
                  rules: [
                    {
                      required: false,
                      message: '请选择用户角色标签!',
                      type: 'array'
                    }
                  ]
                })(
                  <Select mode="multiple" placeholder="请选择用户角色标签">
                    {this.state.user_role_all.map(item => (
                      <Option key={item.user_role_id}>
                        {item.user_role_name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="是否可登录">
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
                  确定
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <Modal
            onOk={() => {
              this.banUser({ type: 'article' })
            }}
            onCancel={() => {
              this.setState({
                isArticleBanVisible: false
              })
            }}
            title="禁言用户发表文章"
            visible={this.state.isArticleBanVisible}
          >
            <div>
              <DatePicker
                onOk={Result => {
                  this.setState({
                    articleBanDate: format(Result, 'YYYY-MM-DD HH:mm:ss')
                  })
                }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: format('00:00:00', 'HH:mm:ss') }}
              />
            </div>
          </Modal>

          <Modal
            onOk={() => {
              this.banUser({ type: 'comment' })
            }}
            onCancel={() => {
              this.setState({
                isCommentBanVisible: false
              })
            }}
            title="禁言用户发表评论"
            visible={this.state.isCommentBanVisible}
          >
            <div>
              <DatePicker
                onOk={Result => {
                  this.setState({
                    commentBanDate: format(Result, 'YYYY-MM-DD HH:mm:ss')
                  })
                }}
                format="YYYY-MM-DD HH:mm:ss"
                showTime={{ defaultValue: format('00:00:00', 'HH:mm:ss') }}
              />
            </div>
          </Modal>

          <div className="layout-table">
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

export default connect(({ state_user }) => {
  return {
    state_user
  }
})(UserForm)
