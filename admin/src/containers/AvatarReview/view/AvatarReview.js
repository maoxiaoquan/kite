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
  Radio,
  Switch,
  Breadcrumb,
  Tag,
  Alert
} from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import './AvatarReview.scss'
import {
  getAvatarReviewList,
  editAvatarReview
} from '../actions/AvatarReviewAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@withRouter
@connect(({ stateUserAvatarReview }) => ({ stateUserAvatarReview }))
class AvatarReview extends React.Component {
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
        title: '头像',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => (
          <div className="avatar-review">
            <img
              style={{ width: 80 + 'px' }}
              src={record.avatar_review}
              alt=""
            />
          </div>
        )
      },
      {
        title: '状态',
        dataIndex: 'avatar_review_status',
        key: 'avatar_review_status',
        render: (text, record) => (
          <Tag className="table-article-tag-list" color="orange">
            {this.state.status_list[record.avatar_review_status]}
          </Tag>
        )
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return record.avatar_review_status === 1 ||
            record.avatar_review_status === 3 ? (
            <div className="table--btn">
              <Button
                onClick={() => {
                  this.editUser(record)
                }}
                size="small"
                type="primary"
              >
                修改
              </Button>
            </div>
          ) : (
            ''
          )
        }
      }
    ],
    pagination: {
      current: 1
    },
    modal_visible_edit: false,
    loading: false,
    status_list: ['', '审核中', '审核通过', '审核失败'],
    status_val: 1
  }

  componentDidMount() {
    this.fetchAvatarReviewList()
  }

  editUser(val) {
    this.setState({
      modal_visible_edit: true
    })
    this.props.dispatch({
      type: 'AVATAR_REVIEW_SET_CURRENT_INFO',
      data: val
    })
    this.props.form.setFieldsValue({
      status: String(val.avatar_review_status)
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
    this.fetchAvatarReviewList(pages)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchUserEdit(values)
      }
    })
  }

  getParams = () => {
    const { status_val } = this.state
    return {
      status: status_val
    }
  }

  fetchAvatarReviewList = () => {
    /*获取文章带分页的列表*/
    let params = this.getParams()
    const that = this
    this.setState({ loading: true })
    const {
      pagination: { current }
    } = this.state
    this.props.dispatch(
      getAvatarReviewList({ params: { page: current, ...params } }, res => {
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
      editAvatarReview(
        {
          uid: this.props.stateUserAvatarReview.current_info.uid,
          ...values
        },
        res => {
          alert.message_success('修改头像成功')
          this.fetchAvatarReviewList()
          this.setState({
            modal_visible_edit: false
          })
        }
      )
    )
  }

  resetBarFrom = () => {
    const data = {
      status_val: ''
    }
    this.setState(data)
  }

  changeVal = (val, type) => {
    let data = {}
    data[type] = val
    this.setState(data)
  }

  render() {
    const { loading, status_list, status_val } = this.state
    const { stateUserAvatarReview = {} } = this.props
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
              <span>用户管理</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>用户头像审核</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="card admin-article layout-card-view">
          <div className="card-body">
            <div className="admin-article-bar">
              <Form layout="inline">
                <FormItem label="状态">
                  <Select
                    className="select-view"
                    value={status_val}
                    onChange={value => {
                      this.changeVal(value, 'status_val')
                    }}
                  >
                    {status_list.map((item, key) => (
                      <Option value={key} key={key}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.fetchAvatarReviewList}
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
                  rules: [
                    {
                      required: true,
                      message: '请选择状态！'
                    }
                  ]
                })(
                  <Select placeholder="状态">
                    {this.state.status_list.map((item, key) => (
                      <Option key={key}>{item}</Option>
                    ))}
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
            dataSource={stateUserAvatarReview.list}
            loading={loading}
            onChange={this.TablePageChange.bind(this)}
            pagination={this.state.pagination}
            rowKey="uid"
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
    )
  }
}

const AvatarReviewForm = Form.create()(AvatarReview)

export default AvatarReviewForm
