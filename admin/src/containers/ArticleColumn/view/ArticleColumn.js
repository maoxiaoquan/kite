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
  InputNumber,
  Breadcrumb,
  Tag,
  Alert
} from 'antd'
import { Link } from 'react-router-dom'

import './ArticleColumn.scss'
import {
  getArticleTagAll,
  getArticleColumnList,
  createArticleColumn,
  updateArticleColumn,
  deleteArticleColumn
} from '../actions/ArticleColumnAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class ArticleColumn extends React.Component {
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
          dataIndex: 'article_column_name',
          key: 'article_column_name'
        },
        {
          title: '专栏单词',
          dataIndex: 'article_column_en_name',
          key: 'article_column_en_name'
        },
        {
          title: '专栏图标',
          dataIndex: 'article_column_icon',
          key: 'article_column_icon'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          key: 'sort'
        },
        {
          title: '专栏图标演示',
          dataIndex: 'article_column_icon',
          key: 'article_column_icon_demo',
          render: (value, record) => {
            return (
              <div className="type">
                <img
                  className="tag-img-icon"
                  src={record.article_column_icon}
                  alt=""
                />
              </div>
            )
          }
        },
        {
          title: '下属专题',
          dataIndex: 'article_tag_ids',
          key: 'article_tag_ids',
          render: (value, record) => {
            return (
              <div className="table-article-tag-view">
                {this.state.article_tag_all.map((item, key) => {
                  let tags = record.article_tag_ids.split(',')
                  return tags.map((child_item, child_key) => {
                    if (item.article_tag_id === child_item) {
                      return (
                        <Tag
                          className="table-article-tag-list"
                          key={child_key}
                          color="orange"
                        >
                          {item.article_tag_name}
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
          title: '备注',
          dataIndex: 'article_column_description',
          key: 'article_column_description'
        },
        {
          title: '是否首页显示',
          dataIndex: 'is_home',
          key: 'is_home',
          render: (value, record) => {
            return (
              <div className="table-is-login">
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
              <div className="table-is-login">
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
      menu_text: ['', '图片', '字体图标'],
      article_tag_all: []
    }
  }

  componentDidMount() {
    this.fetchArticleColumnList()
    this.props.dispatch(
      getArticleTagAll('', res => {
        console.log('res', res)
        this.setState({
          article_tag_all: res.article_tag_all
        })
      })
    )
  }

  _edit = data => {
    /*修改专栏*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({ type: 'SET_ARTICLE_COLUMN_INFO', data: data })
    this.props.form.setFieldsValue({
      ...data,
      article_tag_ids: data.article_tag_ids
        ? data.article_tag_ids.split(',')
        : []
    })
  }

  _delete = value => {
    this.props.dispatch({ type: 'SET_ARTICLE_COLUMN_INFO', data: value })
    confirm({
      title: '确认要删除此专栏吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchDeleteArticleColumn({
          article_column_id: this.props.stateArticleColumn.current_info
            .article_column_id
        })
        /*删除专栏*/
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
    this.fetchArticleColumnList(pages)
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      modal_visible_edit: true,
      is_create: true
    })
    this.props.form.setFields({
      sort: {
        value: this.props.stateArticleColumn.list.length
      }
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { is_create } = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (is_create) {
          this.fetchCreateArticleColumn(values)
        } else {
          this.fetchUpdateArticleColumn(values)
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

  fetchCreateArticleColumn = values => {
    /*创建专栏*/
    this.props.dispatch(
      createArticleColumn(values, res => {
        alert.message_success('创建专栏成功')
        this.fetchArticleColumnList()
        this.setState({
          modal_visible_edit: false
        })
      })
    )
  }

  fetchUpdateArticleColumn = values => {
    /*修改专栏*/
    this.props.dispatch(
      updateArticleColumn(
        {
          article_column_id: this.props.stateArticleColumn.current_info
            .article_column_id,
          ...values
        },
        res => {
          alert.message_success('修改专栏成功')
          this.fetchArticleColumnList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  fetchDeleteArticleColumn = values => {
    /*删除管理员用户*/
    this.props.dispatch(
      deleteArticleColumn(values, res => {
        alert.message_success('删除专栏成功')
        this.fetchArticleColumnList()
      })
    )
  }

  fetchArticleColumnList = () => {
    /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getArticleColumnList({ params: { page: current } }, res => {
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
    const { stateArticleColumn } = this.props
    const { loading, is_create } = this.state
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
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
          offset: 6
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
            <Breadcrumb.Item>文章专栏</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="article-tag-user-create-btn layout-btn"
            icon="plus"
            type="primary"
            onClick={() => this.showModal(0)}
          >
            创建专栏
          </Button>
        </div>

        <div className="card article-column">
          <div className="card-body">
            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_edit: false
                })
              }}
              title="填写专栏"
              visible={this.state.modal_visible_edit}
            >
              <Form className="from-view" onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="专栏名">
                  {getFieldDecorator('article_column_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专栏名！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专栏名" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="专栏名单词">
                  {getFieldDecorator('article_column_en_name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专栏名单词！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专栏名单词" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="专栏名图标">
                  {getFieldDecorator('article_column_icon', {
                    rules: [
                      {
                        required: true,
                        message: '请输入专栏名图标！',
                        whitespace: true
                      }
                    ]
                  })(<Input placeholder="专栏名图标" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="专栏下属专题">
                  {getFieldDecorator('article_tag_ids', {
                    rules: [
                      {
                        required: true,
                        message: '请选择文章专栏下属专题!',
                        type: 'array'
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      placeholder="请选择文章专栏下属专题"
                    >
                      {this.state.article_tag_all.map(item => (
                        <Option key={item.article_tag_id}>
                          {item.article_tag_name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} label="排序">
                  {getFieldDecorator('sort')(<InputNumber />)}
                </FormItem>

                <FormItem {...formItemLayout} hasFeedback label="专栏描述">
                  {getFieldDecorator('article_column_description', {
                    rules: [{ required: true, message: '请输入专栏描述' }]
                  })(<TextArea placeholder="请输入专栏描述" type="text" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="是否首页显示">
                  {getFieldDecorator('is_home', { valuePropName: 'checked' })(
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
                    {is_create ? '创建专栏' : '更新'}
                  </Button>
                </FormItem>
              </Form>
            </Modal>

            <Table
              columns={this.state.columns}
              dataSource={stateArticleColumn.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="article_column_id"
            />

            <Alert
              style={{ marginTop: '20px' }}
              message="备注信息"
              description="文章专栏与文章标题之间的关系是，文章专栏下可以有多个文章标签，一个文章标签可以从属于多个文章专栏，
    创建的文章专栏如果不选择下属标题，默认是关闭状态，只有下属标题大于0，才会开放"
              type="info"
              showIcon
            />
          </div>
        </div>
      </div>
    )
  }
}

const ArticleColumnForm = Form.create()(ArticleColumn)

export default connect(({ stateArticleColumn }) => {
  return {
    stateArticleColumn
  }
})(ArticleColumnForm)
