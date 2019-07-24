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

import './ArticleTag.scss'
import {
  getArticleTagList,
  createArticleTag,
  updateArticleTag,
  deleteArticleTag
} from '../actions/ArticleTagAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class ArticleTag extends React.Component {
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
          title: '标签名',
          dataIndex: 'article_tag_name',
          key: 'article_tag_name'
        },
        {
          title: '标签单词',
          dataIndex: 'article_tag_en_name',
          key: 'article_tag_en_name'
        },
        {
          title: '标签图标地址',
          dataIndex: 'article_tag_icon',
          key: 'article_tag_icon'
        },
        {
          title: '标签演示',
          dataIndex: 'article_tag_icon',
          key: 'article_tag_demo',
          render: (value, record) => {
            return (
              <div className="type">
                <img
                  className="tag-img-icon"
                  src={record.article_tag_icon}
                  alt=""
                />
              </div>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'article_tag_description',
          key: 'article_tag_description'
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
              <div className="table-right-btn">
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
      menu_text: ['', '图片', '字体图标']
    }
  }

  componentDidMount() {
    this.fetch_article_tag_list()
  }

  _edit = data => {
    /*修改标签*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({ type: 'SET_ARTICLE_TAG_INFO', data: data })
    this.props.form.setFieldsValue({
      ...data
    })
  }

  _delete = value => {
    this.props.dispatch({ type: 'SET_ARTICLE_TAG_INFO', data: value })
    confirm({
      title: '确认要删除此标签吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_article_tag({
          article_tag_id: this.props.state_article_tag.current_info
            .article_tag_id
        })
        /*删除标签*/
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
    this.fetch_article_tag_list(pages)
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
          this.fetch_create_article_tag(values)
        } else {
          this.fetch_update_article_tag(values)
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

  fetch_create_article_tag = values => {
    /*创建标签*/
    this.props.dispatch(
      createArticleTag(values, res => {
        alert.message_success('创建标签成功')
        this.fetch_article_tag_list()
        this.setState({
          modal_visible_edit: false
        })
      })
    )
  }

  fetch_update_article_tag = values => {
    /*修改标签*/
    this.props.dispatch(
      updateArticleTag(
        {
          article_tag_id: this.props.state_article_tag.current_info
            .article_tag_id,
          ...values
        },
        res => {
          alert.message_success('修改标签成功')
          this.fetch_article_tag_list()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  fetch_delete_article_tag = values => {
    /*删除管理员用户*/
    this.props.dispatch(
      deleteArticleTag(values, res => {
        alert.message_success('删除标签成功')
        this.fetch_article_tag_list()
      })
    )
  }

  fetch_article_tag_list = () => {
    /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getArticleTagList({ params: { page: current } }, res => {
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
    const { state_article_tag } = this.props
    const { loading, is_create } = this.state
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
          <Icon type="file-text" /> <em>文章标签</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="article-tag-user-create-btn layout-btn"
            icon="plus"
            type="primary"
            onClick={() => this.showModal(0)}
          >
            创建标签
          </Button>
        </div>

        <div className="article-tag">
          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="填写标签"
            visible={this.state.modal_visible_edit}
          >
            <Form className="from-view" onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="标签名">
                {getFieldDecorator('article_tag_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标签名！',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="标签名" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="标签名单词">
                {getFieldDecorator('article_tag_en_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标签单词！',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="标签单词" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="标签图标地址">
                {getFieldDecorator('article_tag_icon', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标签图标！',
                      whitespace: true
                    }
                  ]
                })(<Input placeholder="标签图标地址" />)}
              </FormItem>

              <FormItem {...formItemLayout} hasFeedback label="标签描述">
                {getFieldDecorator('article_tag_description', {
                  rules: [{ required: true, message: '请输入标签描述' }]
                })(<TextArea placeholder="请输入标签描述" type="text" />)}
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
                  {is_create ? '创建标签' : '更新'}
                </Button>
              </FormItem>
            </Form>
          </Modal>

          <div className="layout-table">
            <Table
              columns={this.state.columns}
              dataSource={state_article_tag.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="article_tag_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const ArticleTagsForm = Form.create()(ArticleTag)

export default connect(({ state_article_tag }) => {
  return {
    state_article_tag
  }
})(ArticleTagsForm)
