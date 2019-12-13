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
  Tag,
  Alert
} from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import './Book.scss'
import { getBookList, updateBook, deleteBook } from '../actions'
import alert from '../../../utils/alert'
import { otherStatusList, otherStatusListText } from '../../../utils/constant'
const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@withRouter
@connect(({ stateBook }) => ({ stateBook }))
class Book extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
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
        title: '所属小书',
        dataIndex: 'books_id',
        key: 'books_id',
        render: (text, record) => (
          <a
            className="book-title"
            target="_blank"
            href={`/book/${record.books_id}`}
          >
            {record.books ? record.books.title : '-'}
          </a>
        )
      },
      {
        title: '小书章节标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <a
            className="book-title"
            target="_blank"
            href={`/book/${record.books_id}/section/${record.book_id}`}
          >
            {record.title}
          </a>
        )
      },
      {
        title: '概要',
        dataIndex: 'excerpt',
        key: 'excerpt'
      },
      {
        title: '创建时间',
        dataIndex: 'create_dt',
        key: 'create_dt'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <Tag className="table-book-tag-list" color="orange">
            {this.state.otherStatusListText[record.status]}
          </Tag>
        )
      },
      {
        title: '阅读数',
        dataIndex: 'read_count',
        key: 'read_count',
        render: (text, record) => (
          <Tag className="table-book-tag-list" color="green">
            {record.read_count || 0}
          </Tag>
        )
      },
      {
        title: '评论数',
        dataIndex: 'comment_count',
        key: 'comment_count',
        render: (text, record) => (
          <Tag className="table-book-tag-list" color="green">
            {record.commentCount}
          </Tag>
        )
      },
      {
        title: '拒绝的原因',
        dataIndex: 'rejection_reason',
        key: 'rejection_reason',
        render: (text, record) => (
          <div>
            {~[3, 4, 5].indexOf(record.status) ? record.rejection_reason : ''}
          </div>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <div className="operation-btn">
              <button
                onClick={() => {
                  this.editUser(record)
                }}
                className="btn btn-info"
                size="small"
                type="primary"
              >
                <Icon type="edit" />
              </button>
              <button
                className="btn btn-light"
                onClick={() => {
                  this.deleteBook(record)
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
    modal_visible_edit: false,
    loading: false,
    otherStatusList,
    otherStatusListText,
    title_val: '',
    status_val: '',
    edit_status_val: ''
  }

  componentDidMount() {
    this.fetchBookList()
  }

  editUser(val) {
    console.log('val', val)
    this.setState({
      modal_visible_edit: true,
      edit_status_val: String(val.status)
    })
    this.props.form.setFieldsValue({
      status: String(val.status),
      rejection_reason: val.rejection_reason
    })
    this.props.dispatch({ type: 'BOOK_SET_CURRENT_INFO', data: val })
  }

  deleteBook(val) {
    this.props.dispatch({ type: 'BOOK_SET_CURRENT_INFO', data: val })
    confirm({
      title: '确认要删除此小书章节吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchBookDelete({
          book_id: this.props.stateBook.current_info.book_id
        })
        /*删除小书章节*/
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
    this.fetchBookList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchUserEdit(values)
      }
    })
  }

  fetchBookDelete = values => {
    /*删除小书章节*/
    this.props.dispatch(
      deleteBook(values, res => {
        alert.message_success('删除小书章节成功')
        this.fetchBookList()
      })
    )
  }

  getParams = () => {
    const { title_val, status_val } = this.state
    return {
      title: title_val,
      status: status_val
    }
  }

  fetchBookList = () => {
    /*获取小书章节带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state

    this.props.dispatch(
      getBookList({ page: current, ...params }, res => {
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

  fetchUserEdit = values => {
    /*修改小书章节*/
    this.props.dispatch(
      updateBook(
        { book_id: this.props.stateBook.current_info.book_id, ...values },
        res => {
          alert.message_success('修改小书章节成功')
          this.fetchBookList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  resetBarFrom = () => {
    this.setState(
      {
        title_val: '',
        status_val: ''
      },
      () => {
        this.fetchBookList()
      }
    )
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  render() {
    const { loading, title_val, status_val, edit_status_val } = this.state
    const { stateBook = {} } = this.props
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
          <Breadcrumb>
            <Breadcrumb.Item href="#/manager/index">
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#/manager/index">
              <span>主页</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">
              <span>小书章节管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>小书章节汇总</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="admin-book card">
          <div className="card-body">
            <div className="xsb-operation-menu">
              <Form layout="inline">
                <FormItem label="小书章节标题">
                  <Input
                    value={title_val}
                    onChange={e => {
                      this.changeVal(e.target.value, 'title_val')
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
                    {Object.keys(this.state.otherStatusListText).map(key => (
                      <Option key={key}>
                        {this.state.otherStatusListText[key]}
                      </Option>
                    ))}
                  </Select>
                </FormItem>

                <Form.Item>
                  <button
                    type="primary"
                    className="btn btn-danger"
                    onClick={this.fetchBookList}
                  >
                    搜索
                  </button>
                  <button
                    type="primary"
                    className="btn btn-primary"
                    onClick={this.resetBarFrom}
                  >
                    重置
                  </button>
                </Form.Item>
              </Form>
            </div>

            <Modal
              footer={null}
              onCancel={() => {
                this.setState({
                  modal_visible_edit: false
                })
              }}
              title="修改小书章节"
              visible={this.state.modal_visible_edit}
            >
              <Form className="from-view" onSubmit={this.handleSubmit}>
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
                      {Object.keys(this.state.otherStatusListText).map(key => (
                        <Option key={key}>
                          {this.state.otherStatusListText[key]}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                {~[3, 5].indexOf(Number(edit_status_val)) ? (
                  <FormItem {...formItemLayout} label="拒绝的原因">
                    {getFieldDecorator('rejection_reason', {
                      rules: [
                        {
                          required: true,
                          message: '请输入拒绝的原因！',
                          whitespace: true
                        }
                      ]
                    })(<Input placeholder="小书章节被拒绝的原因" />)}
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
                    更新
                  </Button>
                </FormItem>
              </Form>
            </Modal>

            <Table
              columns={this.state.columns}
              dataSource={stateBook.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="book_id"
            />
          </div>

          <Alert
            style={{ marginTop: '20px' }}
            message="备注"
            description="小书章节发表完成后状态是审核中，是仅对自己可见的，审核不通过也是仅自己可见，并且会标注审核不通过，更改为审核通过的小书章节对所有人开放，
          这种方式是人工审核的，暂时采用这种方案，后续会更改"
            type="info"
            showIcon
          />
        </div>
      </div>
    )
  }
}

const BookForm = Form.create()(Book)

export default BookForm
