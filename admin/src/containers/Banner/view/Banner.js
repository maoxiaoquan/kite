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
  InputNumber,
  Switch,
  Tag
} from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

import './Banner.scss'
import {
  get_banner_list,
  create_banner,
  update_banner,
  delete_banner
} from '../actions/BannerAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = Input

@withRouter
@connect(({state_banner}) => ({state_banner}))

class Banner extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          render: (text, record, index) => (
            <span style={{
              'width': '20px',
              'display': 'block'
            }}>{Number((this.state.pagination.current - 1) * 10) + index + 1}</span>)
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '文章链接',
          dataIndex: 'url',
          key: 'url'
        },
        {
          title: '图片链接',
          dataIndex: 'img_url',
          key: 'img_url',
          render: (value, record) => {
            return (
              <div className="banner-img-preview">
                <img src={record.img_url} alt=""/>
              </div>
            )
          }
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          render: (value, record) => {
            return (
              <div className="table-enable">
                {
                  this.state.banner_type.map(item => {
                    if (item.id === record.type) {
                      return (
                        <Tag color="volcano" key={item.id}>{item.text}</Tag>
                      )
                    }
                  })
                }
              </div>
            )
          }
        },
        {
          title: '序号',
          dataIndex: 'sort',
          key: 'sort',
          render: (value, record) => {
            return (
              <Tag color="volcano">{record.sort}</Tag>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '是否可以用',
          dataIndex: 'enable',
          key: 'enable',
          render: (value, record) => {
            return (
              <div className="table-enable">
                {
                  value ? (<Icon type="check-circle"/>) : (<Icon type="close-circle"/>)
                }
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
      pagination: {
        current: 1
      },
      loading: false,
      confirmDirty: false,
      modal_visible_edit: false,
      modal_visible_authority: false,
      is_create: true,
      role_id: '',
      banner_type: [
        {
          id: '1',
          text: '首页轮播图'
        },
        {
          id: '2',
          text: '首页广告'
        }
      ],
      current_banner_type: ''
    }
  }

  componentDidMount () {
    this.fetch_banner_list()
  }

  _edit = (data) => {/*修改标签*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({type: 'SET_BANNER_INFO', data: data})
    this.props.form.setFieldsValue({
      title: data.title,
      url: data.url,
      img_url: data.img_url,
      type: data.type,
      sort: data.sort,
      description: data.description,
      enable: data.enable
    })
  }

  _delete = (value) => {
    this.props.dispatch({type: 'SET_BANNER_INFO', data: value})
    confirm({
      title: '确认要删除此标签吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_banner({id: this.props.state_banner.current_info.id})
        /*删除标签*/
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
    this.fetch_banner_list(pages)
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

  handleSubmit = (e) => {
    e.preventDefault()
    const {is_create} = this.state
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (is_create) {
          this.fetch_create_banner(values)
        } else {
          this.fetch_update_banner(values)
        }
      }
    })
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }

  selectRole = (value) => {
    this.setState({
      role_id: value
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true})
    }
    callback()
  }

  fetch_create_banner = (values) => {  /*创建标签*/
    this.props.dispatch(create_banner(values, (res) => {
      alert.message_success('创建Banner成功')
      this.fetch_banner_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_update_banner = (values) => { /*修改标签*/
    this.props.dispatch(update_banner({id: this.props.state_banner.current_info.id, ...values}, (res) => {
      alert.message_success('修改Banner成功')
      this.fetch_banner_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_delete_banner = (values) => { /*删除管理员用户*/
    this.props.dispatch(delete_banner(values, (res) => {
      alert.message_success('删除Banner成功')
      this.fetch_banner_list()
    }))
  }

  switch_banner_type = async (val) => {
    await this.setState({
      current_banner_type: val
    })
    this.fetch_banner_list()
  }

  fetch_banner_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}, current_banner_type} = this.state
    this.props.dispatch(get_banner_list({params: {page: current, type: current_banner_type}}, (res) => {
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
    const {state_banner} = this.props
    const {loading, is_create, banner_type} = this.state
    const {getFieldDecorator} = this.props.form

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
          <Icon type="desktop"/> <em>Banner管理</em>
        </div>

        <div className="layout-nav-btn">
          <Button
            className="article-tag-user-create-btn layout-btn"
            icon="plus"
            type="primary"
            onClick={() => this.showModal(0)}
          >创建Banner</Button>
        </div>

        <div className="banner-lay layout-card-view">

          <Modal
            footer={null}
            onCancel={() => {
              this.setState({
                modal_visible_edit: false
              })
            }}
            title="创建Banner"
            visible={this.state.modal_visible_edit}
          >
            <Form
              className="from-view"
              onSubmit={this.handleSubmit}
            >

              <FormItem
                {...formItemLayout}
                label="标题"
              >
                {getFieldDecorator('title', {
                  rules: [{required: true, message: '请输入标题！', whitespace: true}]
                })(
                  <Input placeholder="标题"/>
                )}
              </FormItem>


              <FormItem
                {...formItemLayout}
                label="链接"
              >
                {getFieldDecorator('url', {
                  rules: [{required: true, message: '请输入链接！', whitespace: true}]
                })(
                  <Input placeholder="链接"/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="图片链接"
              >
                {getFieldDecorator('img_url', {
                  rules: [{required: true, message: '请输入图片链接！', whitespace: true}]
                })(
                  <Input placeholder="图片链接"/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                hasFeedback
                label="Banner类型"
              >
                {getFieldDecorator('type', {
                  rules: [
                    {required: true, message: '请选择Banner类型！'}
                  ]
                })(
                  <Select placeholder="Banner类型！">
                    {
                      banner_type.map(item => <Option value={item.id} key={item.id}>{item.text}</Option>)
                    }
                  </Select>
                )}
              </FormItem>


              <Form.Item
                {...formItemLayout}
                label="序号"
              >
                {getFieldDecorator('sort', {initialValue: 1})(
                  <InputNumber min={1} max={10}/>
                )}
                <span className="ant-form-text"> 序号</span>
              </Form.Item>


              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {getFieldDecorator('description', {
                  rules: [{required: true, message: '描述！', whitespace: true}]
                })(
                  <Input placeholder="描述"/>
                )}
              </FormItem>

              <FormItem
                {...formItemLayout}
                label="是否有效"
              >
                {getFieldDecorator('enable', {valuePropName: 'checked'})(
                  <Switch/>
                )}
              </FormItem>

              <FormItem
                {...tailFormItemLayout}
              >
                <Button
                  className="create-btn"
                  htmlType="submit"
                  type="primary"
                >
                  {
                    is_create ? '创建' : '更新'
                  }
                </Button>
              </FormItem>
            </Form>
          </Modal>


          <div className="nav-search-view">
            <label className="label-text">类型:</label>
            <Button onClick={() => {
              this.switch_banner_type('')
            }}>全部</Button>
            {
              banner_type.map(item => <Button key={item.id} onClick={() => {
                this.switch_banner_type(item.id)
              }}>{item.text}</Button>)
            }
          </div>

          <Table
            columns={this.state.columns}
            dataSource={state_banner.list}
            loading={loading}
            onChange={this.TablePageChange.bind(this)}
            pagination={this.state.pagination}
            rowKey="id"
          />

        </div>
      </div>
    )
  }
}

const ArticleTagsForm = Form.create()(Banner)

export default ArticleTagsForm

