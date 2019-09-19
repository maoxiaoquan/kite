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
  Breadcrumb,
  Tag
} from 'antd'
import { Link } from 'react-router-dom'

import './ArticleBlog.scss'
import { getArticleBlogList, updateArticleBlog } from '../actions'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class ArticleBlog extends React.Component {
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
          title: '专栏名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '专栏英文名字',
          dataIndex: 'en_name',
          key: 'en_name'
        },
        {
          title: '专栏图标地址',
          dataIndex: 'icon',
          key: 'icon'
        },
        {
          title: '专栏图标演示',
          dataIndex: 'icon',
          key: 'icon',
          render: (text, record) => (
            <div className="avatar">
              {record.icon ? <img src={record.icon} alt="" /> : ''}
            </div>
          )
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="red">
              {this.state.status_list[record.status]}
            </Tag>
          )
        },
        {
          title: '备注',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '是否公开',
          dataIndex: 'is_public',
          key: 'is_public',
          render: (value, record) => {
            return (
              <div className="table-is-login">{value ? '公开' : '个人'}</div>
            )
          }
        },
        {
          title: '审核被拒绝的原因',
          dataIndex: 'rejection_reason',
          key: 'rejection_reason'
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                {record.is_public ? (
                  <Button
                    onClick={() => {
                      this._edit(record)
                    }}
                    size="small"
                    type="primary"
                  >
                    修改
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
      modal_visible_edit: false,
      status_list: ['未知', '审核中', '审核通过', '审核失败', '无需审核'],
      is_create: true,
      edit_status_val: '',
      status_val: '',
      is_public_val: '',
      name_val: ''
    }
  }

  componentDidMount() {
    this.fetchArticleBlogList()
  }

  _edit = data => {
    /*修改专栏*/
    this.setState({
      modal_visible_edit: true,
      is_create: false,
      edit_status_val: String(data.status)
    })

    this.props.dispatch({ type: 'SET_ARTICLE_BLOG_INFO', data: data })
    this.props.form.setFieldsValue({
      ...data,
      status: String(data.status)
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
    this.fetchArticleBlogList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    const { is_create } = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.fetchUpdateArticleBlog(values)
      }
    })
  }

  fetchUpdateArticleBlog = values => {
    /*修改专栏*/
    this.props.dispatch(
      updateArticleBlog(
        {
          blog_id: this.props.stateArticleBlog.current_info.blog_id,
          ...values
        },
        res => {
          alert.message_success('修改专栏成功')
          this.fetchArticleBlogList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  resetBarFrom = () => {
    this.setState(
      {
        name_val: '',
        status_val: ''
      },
      () => {
        this.fetchArticleBlogList()
      }
    )
  }

  getParams = () => {
    const { name_val, status_val, is_public_val } = this.state
    return {
      name: name_val,
      status: status_val,
      is_public: is_public_val
    }
  }

  fetchArticleBlogList = () => {
    /*获取管理员用户带分页的列表*/
    const that = this
    let params = this.getParams()
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getArticleBlogList({ params: { page: current, ...params } }, res => {
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
    const {
      loading,
      status_list,
      status_val,
      name_val,
      is_public_val,
      is_create,
      edit_status_val
    } = this.state
    const { stateArticleBlog } = this.props
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
              <span>文章管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>个人专栏</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="layout-nav-btn"></div>

        <div className="article-blog">
          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="修改个人专栏"
            visible={this.state.modal_visible_edit}
          >
            <Form className="from-view" onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="个人专栏名">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入个人专栏名！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled placeholder="个人专栏名" />)}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="状态">
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '请选择状态！' }]
                })(
                  <Select
                    placeholder="状态"
                    onChange={value => {
                      this.setState({
                        edit_status_val: value
                      })
                    }}
                  >
                    {this.state.status_list.map((item, key) =>
                      item ? <Option key={key}>{item}</Option> : ''
                    )}
                  </Select>
                )}
              </FormItem>

              {~[3, 4, 5].indexOf(Number(edit_status_val)) ? (
                <FormItem {...formItemLayout} label="拒绝的原因">
                  {getFieldDecorator('rejection_reason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入拒绝的原因！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="文章被拒绝的原因" />)}
                </FormItem>
              ) : (
                ''
              )}

              <FormItem {...tailFormItemLayout}>
                <Button
                  className="register-btn"
                  htmlType="submit"
                  type="primary"
                >
                  {is_create ? '创建专栏' : '更新'}
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <div className="card">
            <div className="card-body">
              <div className="dynamic-article-bar">
                <Form layout="inline">
                  <FormItem label="个人专题标题">
                    <Input
                      value={name_val}
                      onChange={e => {
                        this.changeVal(e.target.value, 'name_val')
                      }}
                    />
                  </FormItem>
                  <FormItem label="状态">
                    <Select
                      className="select-view"
                      value={status_val}
                      onChange={value => {
                        this.changeVal(value, 'status_val')
                      }}
                    >
                      <Option value="">全部</Option>
                      {status_list.map((item, key) =>
                        item ? (
                          <Option value={key} key={key}>
                            {item}
                          </Option>
                        ) : (
                          ''
                        )
                      )}
                    </Select>
                  </FormItem>

                  <FormItem hasFeedback label="是否公开">
                    <Select
                      placeholder="状态"
                      value={is_public_val}
                      onChange={value => {
                        this.changeVal(value, 'is_public_val')
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value={0}>个人</Option>
                      <Option value={1}>公开</Option>
                    </Select>
                  </FormItem>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.fetchArticleBlogList}
                    >
                      搜索
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.resetBarFrom}
                    >
                      重置
                    </Button>
                  </Form.Item>
                </Form>
              </div>

              <Table
                columns={this.state.columns}
                dataSource={stateArticleBlog.list}
                loading={loading}
                onChange={this.TablePageChange.bind(this)}
                pagination={this.state.pagination}
                rowKey="blog_id"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const ArticleBlogForm = Form.create()(ArticleBlog)

export default connect(({ stateArticleBlog }) => {
  return {
    stateArticleBlog
  }
})(ArticleBlogForm)
