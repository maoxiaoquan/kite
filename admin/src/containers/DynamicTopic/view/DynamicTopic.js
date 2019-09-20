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
  Breadcrumb,
  InputNumber
} from 'antd'
import { Link } from 'react-router-dom'

import './DynamicTopic.scss'
import {
  getDynamicTopicList,
  createDynamicTopic,
  updateDynamicTopic,
  deleteDynamicTopic
} from '../actions/DynamicTopicAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class DynamicTopic extends React.Component {
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
          title: '专题名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '专题单词',
          dataIndex: 'en_name',
          key: 'en_name'
        },
        {
          title: '专题图标地址',
          dataIndex: 'icon',
          key: 'icon'
        },
        {
          title: '专题演示',
          dataIndex: 'icon',
          key: 'demo',
          render: (value, record) => {
            return (
              <div className="type">
                <img className="tag-img-icon" src={record.icon} alt="" />
              </div>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '订阅数量',
          dataIndex: 'rss_count',
          key: 'rss_count'
        },
        {
          title: '是否首页侧栏显示',
          dataIndex: 'is_show',
          key: 'is_show',
          render: (value, record) => {
            return (
              <div className="table-is-login">
                {record.is_show ? (
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
              <div className="table-is-login">
                {record.enable ? (
                  <Icon type="check-circle" />
                ) : (
                  <Icon type="close-circle" />
                )}
              </div>
            )
          }
        },
        {
          title: '是否加入首页或者推荐',
          dataIndex: 'is_push',
          key: 'is_push',
          render: (value, record) => {
            return (
              <div className="table-is-login">
                {record.is_push ? (
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
              <div className="operation-btn">
                <button
                  onClick={() => {
                    this._edit(record)
                  }}
                  size="small"
                  type="primary"
                  className="btn btn-info"
                >
                  <Icon type="edit" />
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    this._delete(record)
                  }}
                  size="small"
                >
                  <Icon type="delete" />
                </button>
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
      role_id: '',
      menu_text: ['', '图片', '字体图标']
    }
  }

  componentDidMount() {
    this.fetchDynamicTopicList()
  }

  _edit = data => {
    /*修改专题*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({ type: 'SET_DYNAMIC_TOPIC_INFO', data: data })
    this.props.form.setFieldsValue({
      ...data
    })
  }

  _delete = value => {
    this.props.dispatch({ type: 'SET_DYNAMIC_TOPIC_INFO', data: value })
    confirm({
      title: '确认要删除此专题吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchDeleteDynamicTopic({
          topic_id: this.props.stateDynamicTopic.current_info.topic_id
        })
        /*删除专题*/
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
    this.fetchDynamicTopicList(pages)
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modal_visible_edit: true,
      is_create: true
    })
    this.props.form.setFields({
      sort: {
        value: this.props.stateDynamicTopic.list.length
      }
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
          this.fetchCreateDynamicTopic(values)
        } else {
          this.fetchUpdateDynamicTopic(values)
        }
      }
    })
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  fetchCreateDynamicTopic = values => {
    /*创建专题*/
    this.props.dispatch(
      createDynamicTopic(values, res => {
        alert.message_success('创建专题成功')
        this.fetchDynamicTopicList()
        this.setState({
          modal_visible_edit: false
        })
      })
    )
  }

  fetchUpdateDynamicTopic = values => {
    /*修改专题*/
    this.props.dispatch(
      updateDynamicTopic(
        {
          topic_id: this.props.stateDynamicTopic.current_info.topic_id,
          ...values
        },
        res => {
          alert.message_success('修改专题成功')
          this.fetchDynamicTopicList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  fetchDeleteDynamicTopic = values => {
    /*删除管理员用户*/
    this.props.dispatch(
      deleteDynamicTopic(values, res => {
        alert.message_success('删除专题成功')
        this.fetchDynamicTopicList()
      })
    )
  }

  fetchDynamicTopicList = () => {
    /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getDynamicTopicList({ params: { page: current } }, res => {
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

  render() {
    const { stateDynamicTopic } = this.props
    const { loading, is_create } = this.state
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
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
          offset: 8
        }
      }
    }

    return (
      <div className="layout-main">
        <div className="layout-main-title">
          <Breadcrumb>
            <Breadcrumb.Item href="#/manager/index">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#/manager/index">
              <span>主页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">
              <span>动态管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>动态专题</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="layout-nav-btn">
          <button
            className="btn btn-danger"
            icon="plus"
            type="primary"
            onClick={() => this.showModal(0)}
          >
            创建专题
          </button>
        </div>

        <div className="card article-tag">
          <div className="card-body">
            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_edit: false
                })
              }}
              title="填写专题"
              visible={this.state.modal_visible_edit}
            >
              <Form className="from-view" onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="专题名">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专题名！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专题名" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="专题名单词">
                  {getFieldDecorator('en_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专题单词！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专题单词" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="专题图标地址">
                  {getFieldDecorator('icon', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专题图标！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专题图标地址" />)}
                </FormItem>

                <FormItem {...formItemLayout} hasFeedback label="专题描述">
                  {getFieldDecorator('description', {
                    rules: [{ required: true, message: '请输入专题描述' }]
                  })(<TextArea placeholder="请输入专题描述" type="text" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="首页显示">
                  {getFieldDecorator('is_show', { valuePropName: 'checked' })(
                    <Switch />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="是否有效">
                  {getFieldDecorator('enable', { valuePropName: 'checked' })(
                    <Switch />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="是否加入首页或者推荐">
                  {getFieldDecorator('is_push', { valuePropName: 'checked' })(
                    <Switch />
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="排序">
                  {getFieldDecorator('sort')(<InputNumber />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                  <Button
                    className="register-btn"
                    htmlType="submit"
                    type="primary"
                  >
                    {is_create ? '创建专题' : '更新'}
                  </Button>
                </FormItem>
              </Form>
            </Modal>

            <Table
              columns={this.state.columns}
              dataSource={stateDynamicTopic.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="topic_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const DynamicTopicsForm = Form.create()(DynamicTopic)

export default connect(({ stateDynamicTopic }) => {
  return {
    stateDynamicTopic
  }
})(DynamicTopicsForm)
