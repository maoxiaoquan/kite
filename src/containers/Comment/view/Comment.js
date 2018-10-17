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

import './Comment.scss'
import {
  get_comment_list,
  update_comment,
  delete_comment
} from '../actions/CommentAction'
import alert from '../../../utils/alert'
import state_comment from '../reducer/CommentReducer'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = Input

class Comment extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '评论内容',
          dataIndex: 'content',
          key: 'content'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">{this.state.status[record.status]}</Tag>)
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => {
            return (
              <div className="table-right-btn">
                <Button onClick={() => { this._edit(record) }} size="small"
                        type="primary"
                >修改</Button>
                <Button className="box-btn-red"
                        onClick={() => {
                          this._delete(record)
                        }}
                        size="small"
                >删除</Button>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false,
      modal_visible_edit: false,
      status: ['', '审核中', '审核通过', '回收站']
    }
  }

  componentDidMount () {
    this.fetch_comment_list()
  }

  _edit = (data) => {/*修改标签*/
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({type: 'SET_COMMENT_INFO', data: data})
    this.props.form.setFieldsValue({
      status: String(data.status)
    })
  }

  _delete = (value) => {
    this.props.dispatch({type: 'SET_COMMENT_INFO', data: value})
    confirm({
      title: '确认要删除此条用户评论吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_comment({id: this.props.state_comment.current_info.id})
        /*删除用户评论*/
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
    this.fetch_user_tag_list(pages)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.fetch_update_comment(values)
      }
    })
  }

  fetch_update_comment = (values) => { /*修改用户评论*/
    this.props.dispatch(update_comment({id: this.props.state_comment.current_info.id, ...values}, (res) => {
      alert.message_success('修改用户评论成功')
      this.fetch_comment_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_delete_comment = (values) => { /*删除用户评论*/
    this.props.dispatch(delete_comment(values, (res) => {
      alert.message_success('删除用户评论成功')
      this.fetch_comment_list()
    }))
  }

  fetch_comment_list = () => {  /*获取用户评论带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_comment_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  render () {
    const {state_comment} = this.props
    const {loading} = this.state
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
          <h2><strong>评论管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
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
                  {...tailFormItemLayout}
                >
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

            <Table
              columns={this.state.columns}
              dataSource={state_comment.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const CommentForm = Form.create()(Comment)

export default connect(({state_comment}) => {
  return {
    state_comment
  }
})(CommentForm)

