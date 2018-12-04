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
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'aid',
          dataIndex: 'aid',
          key: 'aid'
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '概要',
          dataIndex: 'excerpt',
          key: 'excerpt'
        },
        {
          title: '创建时间',
          dataIndex: 'create_date',
          key: 'create_date'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">{this.state.status[record.status]}</Tag>)
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="red">{this.state.type[record.type]}</Tag>)
        },
        {
          title: '来源',
          dataIndex: 'source',
          key: 'source',
          render: (text, record) => {
            console.log('record', record)
            return (<Tag className="table-article-tag-list"
                         color="red">{this.state.source[Number(record.source) - 1]}</Tag>)
          }
        },
        {
          title: '阅读数',
          dataIndex: 'read_count',
          key: 'read_count',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="green">{record.read_count}</Tag>)
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
      loading: false,
      status: ['草稿', '审核中', '审核通过', '回收站'],
      type: ['', '文章', '说说', '视频', '公告'],
      source: ['原创', '转载']
    }
  }

  componentDidMount () {
    this.fetch_article_list()
  }

  editUser (val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({type: 'ARTICLE_SET_CURRENT_INFO', data: val})
    this.props.form.setFieldsValue({
      status: String(val.status),
      type: val.type,
      source: val.source
    })
  }

  deleteArticle (val) {
    this.props.dispatch({type: 'ARTICLE_SET_CURRENT_INFO', data: val})
    confirm({
      title: '确认要删除此文章吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_article_delete({aid: this.props.state_article.current_info.aid})
        /*删除管理员用户*/
      },
      onCancel () {
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

  fetch_article_delete = (values) => { /*删除文章*/
    this.props.dispatch(delete_article(values, (res) => {
      alert.message_success('删除文章成功')
      this.fetch_article_list()
    }))
  }

  fetch_article_list = () => {  /*获取文章带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_article_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  fetch_user_edit = (values) => { /*修改文章*/
    this.props.dispatch(edit_user({aid: this.props.state_article.current_info.aid, ...values}, (res) => {
      alert.message_success('修改用户成功')
      this.fetch_article_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  render () {
    const {loading} = this.state
    const {state_article = {}} = this.props
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

      <div className="layout-main">

        <div className="layout-main-title">
          <Icon type="user"/> <em>权限菜单</em>
        </div>


        <div className="admin-article">

          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="修改文章"
            visible={this.state.modal_visible_edit}
          >
            <Form
              className="from-view"
              onSubmit={this.handleSubmit}
            >

              <FormItem
                {...formItemLayout}
                hasFeedback
                label="状态"
              >
                {getFieldDecorator('status', {
                  rules: [
                    {required: true, message: '请选择状态！'}
                  ]
                })(
                  <Select placeholder="状态">
                    {
                      this.state.status.map((item, key) => <Option key={key}>{item}</Option>)
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                hasFeedback
                label="类型"
              >
                {getFieldDecorator('type', {
                  rules: [
                    {required: true, message: '请选择类型！'}
                  ]
                })(
                  <Select placeholder="类型">
                    {
                      this.state.type.map((item, key) => <Option key={key}>{item}</Option>)
                    }
                  </Select>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                hasFeedback
                label="来源"
              >
                {getFieldDecorator('source', {
                  rules: [
                    {required: true, message: '请选择来源！'}
                  ]
                })(
                  <Select placeholder="来源">
                    <Option key="1">原创</Option>
                    <Option key="2">转载</Option>
                  </Select>
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


          <div className="layout-table">
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

export default connect(({state_article}) => {
  return {
    state_article
  }
})(ArticleForm)

