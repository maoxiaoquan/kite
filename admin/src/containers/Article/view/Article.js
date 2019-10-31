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

import './Article.scss'
import {
  getArticleList,
  editArticle,
  deleteArticle
} from '../actions/ArticleAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@withRouter
@connect(({ stateArticle }) => ({ stateArticle }))
class Article extends React.Component {
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
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <a
            className="article-title"
            target="_blank"
            href={`/p/${record.aid}`}
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
          <Tag className="table-article-tag-list" color="orange">
            {this.state.statusList[record.status]}
          </Tag>
        )
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="red">
            {this.state.articleType[record.type]}
          </Tag>
        )
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
        render: (text, record) => {
          return (
            <Tag className="table-article-tag-list" color="red">
              {this.state.source_list[Number(record.source)]}
            </Tag>
          )
        }
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
            {record.status === 'review_fail' ? record.rejection_reason : ''}
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
                  this.deleteArticle(record)
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
    statusList: {
      // 所有内容的审核状态
      review_success: '审核成功', // 审核成功
      review_fail: '审核失败', // 审核失败
      pending_review: '待审核', // 待审核
      free_review: '免审核', // 免审核
      deleted: '已删除' // 已删除
    },
    articleType: {
      // 文章的类型
      article: '文章', // 文章
      note: '笔记', // 笔记
      draft: '草稿' // 草稿
    },
    source_list: ['', '原创', '转载'],
    title_val: '',
    status_val: '',
    type_val: '',
    source_val: '',
    edit_status_val: ''
  }

  componentDidMount() {
    this.fetchArticleList()
  }

  editUser(val) {
    console.log('val', val)
    this.setState({
      modal_visible_edit: true,
      edit_status_val: String(val.status)
    })
    this.props.form.setFieldsValue({
      status: String(val.status),
      type: String(val.type),
      source: String(val.source),
      rejection_reason: val.rejection_reason
    })
    this.props.dispatch({ type: 'ARTICLE_SET_CURRENT_INFO', data: val })
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
        this.fetchArticleDelete({
          aid: this.props.stateArticle.current_info.aid
        })
        /*删除文章*/
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
    this.fetchArticleList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchUserEdit(values)
      }
    })
  }

  fetchArticleDelete = values => {
    /*删除文章*/
    this.props.dispatch(
      deleteArticle(values, res => {
        alert.message_success('删除文章成功')
        this.fetchArticleList()
      })
    )
  }

  getParams = () => {
    const { title_val, status_val, type_val, source_val } = this.state
    return {
      title: title_val,
      source: source_val,
      status: status_val,
      type: type_val
    }
  }

  fetchArticleList = () => {
    /*获取文章带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state

    this.props.dispatch(
      getArticleList({ page: current, ...params }, res => {
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
    /*修改文章*/
    this.props.dispatch(
      editArticle(
        { aid: this.props.stateArticle.current_info.aid, ...values },
        res => {
          alert.message_success('修改文章成功')
          this.fetchArticleList()
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
        source_val: '',
        status_val: '',
        type_val: ''
      },
      () => {
        this.fetchArticleList()
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
      statusList,
      articleType,
      source_list,
      title_val,
      status_val,
      type_val,
      source_val,
      edit_status_val
    } = this.state
    const { stateArticle = {} } = this.props
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
              <span>文章管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>文章汇总</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="admin-article card">
          <div className="card-body">
            <div className="xsb-operation-menu">
              <Form layout="inline">
                <FormItem label="文章标题">
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
                    {Object.keys(this.state.statusList).map(key => (
                      <Option key={key}>{this.state.statusList[key]}</Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem label="类型">
                  <Select
                    className="select-view"
                    value={type_val}
                    onChange={value => {
                      this.changeVal(value, 'type_val')
                    }}
                  >
                    <Option value="">全部</Option>
                    {Object.keys(this.state.articleType).map(key => (
                      <Option key={key}>{this.state.articleType[key]}</Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem label="来源：">
                  <Select
                    className="select-view"
                    value={source_val}
                    onChange={value => {
                      this.changeVal(value, 'source_val')
                    }}
                  >
                    <Option value="">全部</Option>
                    {source_list.map((item, key) =>
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
                    onClick={this.fetchArticleList}
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
              title="修改文章"
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
                      {Object.keys(this.state.statusList).map(key => (
                        <Option key={key}>{this.state.statusList[key]}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                {edit_status_val === 'review_fail' ? (
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

                <FormItem {...formItemLayout} hasFeedback label="类型">
                  {getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择类型！' }]
                  })(
                    <Select placeholder="类型">
                      {Object.keys(this.state.articleType).map(key => (
                        <Option key={key}>{this.state.articleType[key]}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>

                <FormItem {...formItemLayout} hasFeedback label="来源">
                  {getFieldDecorator('source', {
                    rules: [{ required: true, message: '请选择来源！' }]
                  })(
                    <Select placeholder="来源">
                      {source_list.map((item, key) =>
                        item ? <Option key={key}>{item}</Option> : ''
                      )}
                    </Select>
                  )}
                </FormItem>

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
              dataSource={stateArticle.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="aid"
            />
          </div>

          <Alert
            style={{ marginTop: '20px' }}
            message="备注信息"
            description="文章发表完成后状态是审核中，是仅对自己可见的，审核不通过也是仅自己可见，并且会标注审核不通过，更改为审核通过的文章对所有人开放，
          这种方式是人工审核的，暂时采用这种方案，后续会更改"
            type="info"
            showIcon
          />
        </div>
      </div>
    )
  }
}

const ArticleForm = Form.create()(Article)

export default ArticleForm
