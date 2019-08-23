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

import './ArticleComment.scss'
import {
  getCommentList,
  updateComment,
  deleteComment
} from '../actions/CommentAction'
import alert from '../../../utils/alert'
import faceqq from './qq'
const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const { TextArea } = Input

class ArticleComment extends React.Component {
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
          title: '评论内容',
          dataIndex: 'content',
          key: 'content',
          render: (text, record) => (
            <div
              dangerouslySetInnerHTML={{
                __html: this.commentRender(record.content)
              }}
            />
          )
        },
        {
          title: '来自文章',
          dataIndex: 'article',
          key: 'article',
          render: (text, record) => (
            <div>
              <a href={`/p/${record.article.aid}`} target="_block">
                {record.article.title}
              </a>
            </div>
          )
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          render: (text, record) => (
            <Tag className="table-article-tag-list" color="orange">
              {this.state.status[record.status]}
            </Tag>
          )
        },
        {
          title: '评论时间',
          dataIndex: 'create_at',
          key: 'create_at'
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
      modal_visible_edit: false,
      status: ['', '未审核', '审核通过', '审核失败', '回收站', '无需审核'],
      content_val: '',
      status_val: ''
    }
  }

  componentDidMount() {
    this.fetchCommentList()
  }

  _edit = data => {
    /*修改标签*/
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({ type: 'SET_COMMENT_INFO', data: data })
    this.props.form.setFieldsValue({
      status: String(data.status)
    })
  }

  _delete = value => {
    this.props.dispatch({ type: 'SET_COMMENT_INFO', data: value })
    confirm({
      title: '确认要删除此条用户评论吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchDeleteComment({
          id: this.props.stateArticleComment.current_info.id
        })
        /*删除用户评论*/
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  commentRender = val => {
    console.log('val', val)
    let newComment = val
    faceqq.map(faceItem => {
      newComment = newComment.replace(
        new RegExp('\\' + faceItem.face_text, 'g'),
        faceItem.face_view
      )
    })
    return newComment
  }

  TablePageChange = async pages => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })
    this.fetchCommentList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.fetchUpdateComment(values)
      }
    })
  }

  fetchUpdateComment = values => {
    /*修改用户评论*/
    this.props.dispatch(
      updateComment(
        { id: this.props.stateArticleComment.current_info.id, ...values },
        res => {
          alert.message_success('修改用户评论成功')
          this.fetchCommentList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  getParams = () => {
    const { content_val, status_val } = this.state
    return {
      content: content_val,
      status: status_val
    }
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  resetBarFrom = () => {
    const data = {
      content_val: '',
      status_val: ''
    }
    this.setState(data)
  }

  fetchDeleteComment = values => {
    /*删除用户评论*/
    this.props.dispatch(
      deleteComment(values, res => {
        alert.message_success('删除用户评论成功')
        this.fetchCommentList()
      })
    )
  }

  fetchCommentList = () => {
    /*获取用户评论带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getCommentList({ page: current, ...params }, res => {
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
    const { stateArticleComment } = this.props
    const { loading, content_val, status_val } = this.state
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
          <Icon type="user" /> <em>用户评论管理</em>
        </div>

        <div className="admin-comment layout-card-view">
          <div className="admin-comment-bar">
            <Form layout="inline">
              <FormItem label="文章标题">
                <Input
                  value={content_val}
                  onChange={e => {
                    this.changeVal(e.target.value, 'content_val')
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
                  {this.state.status.map((item, key) =>
                    item ? <Option key={key}>{item}</Option> : ''
                  )}
                </Select>
              </FormItem>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.fetchCommentList}
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
            dataSource={stateArticleComment.list}
            loading={loading}
            onChange={this.TablePageChange.bind(this)}
            pagination={this.state.pagination}
            rowKey="id"
          />
        </div>

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
            <FormItem {...formItemLayout} hasFeedback label="状态">
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择状态！' }]
              })(
                <Select placeholder="状态">
                  {this.state.status.map((item, key) =>
                    item ? <Option key={key}>{item}</Option> : ''
                  )}
                </Select>
              )}
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button className="register-btn" htmlType="submit" type="primary">
                确定
              </Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

const ArticleCommentForm = Form.create()(ArticleComment)

export default connect(({ stateArticleComment }) => {
  return {
    stateArticleComment
  }
})(ArticleCommentForm)
