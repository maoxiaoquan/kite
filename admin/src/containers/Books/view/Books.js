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

import './Books.scss'
import { getBooksList, updateBooks, deleteBooks } from '../actions'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@withRouter
@connect(({ stateBooks }) => ({ stateBooks }))
class Books extends React.Component {
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
        title: '小书标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <a
            className="article-title"
            target="_blank"
            href={`/book/${record.books_id}`}
          >
            {record.title}
          </a>
        )
      },
      {
        title: '创建时间',
        dataIndex: 'create_dt',
        key: 'create_dt'
      },
      {
        title: '小书封面演示',
        dataIndex: 'cover_img',
        key: 'cover_img',
        render: (text, record) => (
          <div className="avatar img-preview">
            {record.cover_img ? <img src={record.cover_img} alt="" /> : ''}
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="orange">
            {this.state.status_list[record.status]}
          </Tag>
        )
      },
      {
        title: '阅读数',
        dataIndex: 'read_count',
        key: 'read_count',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="green">
            {record.read_count}
          </Tag>
        )
      },
      {
        title: '评论数',
        dataIndex: 'comment_count',
        key: 'comment_count',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="green">
            {record.comment_count}
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
                  this.deleteBooks(record)
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
    status_list: ['', '审核中', '审核通过', '审核失败', '无需审核', '已删除'],
    title_val: '',
    status_val: '',
    edit_status_val: ''
  }

  componentDidMount() {
    this.fetchBooksList()
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
    this.props.dispatch({ type: 'BOOKS_SET_CURRENT_INFO', data: val })
  }

  deleteBooks(val) {
    this.props.dispatch({ type: 'BOOKS_SET_CURRENT_INFO', data: val })
    confirm({
      title: '确认要删除此小书吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetchBooksDelete({
          books_id: this.props.stateBooks.current_info.books_id
        })
        /*删除小书*/
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
    this.fetchBooksList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchUserEdit(values)
      }
    })
  }

  fetchBooksDelete = values => {
    /*删除小书*/
    this.props.dispatch(
      deleteBooks(values, res => {
        alert.message_success('删除小书成功')
        this.fetchBooksList()
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

  fetchBooksList = () => {
    /*获取小书带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state

    this.props.dispatch(
      getBooksList({ page: current, ...params }, res => {
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
    /*修改小书*/
    this.props.dispatch(
      updateBooks(
        { books_id: this.props.stateBooks.current_info.books_id, ...values },
        res => {
          alert.message_success('修改小书成功')
          this.fetchBooksList()
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
        this.fetchBooksList()
      }
    )
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  render() {
    const {
      loading,
      status_list,
      title_val,
      status_val,
      edit_status_val
    } = this.state
    const { stateBooks = {} } = this.props
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
              <span>小书管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>小书汇总</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="admin-article card">
          <div className="card-body">
            <div className="xsb-operation-menu">
              <Form layout="inline">
                <FormItem label="小书标题">
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

                <Form.Item>
                  <button
                    type="primary"
                    htmlType="submit"
                    className="btn btn-danger"
                    onClick={this.fetchBooksList}
                  >
                    搜索
                  </button>
                  <button
                    type="primary"
                    htmlType="submit"
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
              title="修改小书"
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
                      {this.state.status_list.map((item, key) =>
                        item ? <Option key={key}>{item}</Option> : ''
                      )}
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
                    })(<Input placeholder="小书被拒绝的原因" />)}
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
              dataSource={stateBooks.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="books_id"
            />
          </div>

          <Alert
            style={{ marginTop: '20px' }}
            message="备注信息"
            description="小书发表完成后状态是审核中，是仅对自己可见的，审核不通过也是仅自己可见，并且会标注审核不通过，更改为审核通过的小书对所有人开放，
          这种方式是人工审核的，暂时采用这种方案，后续会更改"
            type="info"
            showIcon
          />
        </div>
      </div>
    )
  }
}

const BooksForm = Form.create()(Books)

export default BooksForm
