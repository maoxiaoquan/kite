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

import './Article.scss'
import {
  get_article_list,
  edit_user,
  delete_article
} from '../actions/ArticleAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

class Article extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'aid',
          dataIndex: 'aid',
          key: 'aid'
        },
        {
          title: '作者',
          dataIndex: 'author',
          key: 'author'
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '创建时间',
          dataIndex: 'create_date',
          key: 'create_date'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status'
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '类别',
          dataIndex: 'category',
          key: 'category'
        },
        {
          title: '阅读数',
          dataIndex: 'read_count',
          key: 'read_count'
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
                    this.deleteArticle(record)
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
    this.fetch_article_list()
  }

  editUser(val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({ type: 'ARTICLE_SET_CURRENT_INFO', data: val })
    this.props.form.setFieldsValue({
      nickname: val.nickname,
      enable: val.enable,
      password: '',
      confirm: ''
    })
  }

  deleteArticle(val) {
    this.props.dispatch({ type: 'ARTICLE_SET_CURRENT_INFO', data: val })
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_article_delete({ aid: this.props.state_article.current_info.aid })
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
    this.fetch_article_list(pages)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetch_user_edit(values)
      }
    })
  }

  fetch_article_delete = (values) => { /*删除管理员用户*/
    this.props.dispatch(delete_article(values, (res) => {
      alert.message_success('删除文章成功')
      this.fetch_article_list()
    }))
  }

  fetch_article_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({ loading: true })
    const { pagination: { current } } = this.state
    this.props.dispatch(get_article_list({ params: { page: current } }, (res) => {
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
    this.props.dispatch(edit_user({ uid: this.props.state_article.current_info.uid, ...values }, (res) => {
      alert.message_success('修改用户成功')
      this.fetch_article_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  render() {
    const { loading } = this.state
    const { state_article = {} } = this.props
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
              dataSource={state_article.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="aid"
            />
          </div>
        </div>
      </div>
    )
  }
}

const ArticleForm = Form.create()(Article)

export default connect(({ state_article }) => {
  return {
    state_article
  }
})(ArticleForm)

