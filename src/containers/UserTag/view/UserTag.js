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

import './UserTag.scss'
import {
  get_user_tag_list,
  create_user_tag,
  update_user_tag,
  delete_user_tag
} from '../actions/UserTagAction'
import alert from '../../../utils/alert'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm
const {TextArea} = Input

class UserTag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: 'user_tag_id',
          dataIndex: 'user_tag_id',
          key: 'user_tag_id'
        },
        {
          title: '标签名',
          dataIndex: 'user_tag_name',
          key: 'user_tag_name'
        },
        {
          title: '标签图标',
          dataIndex: 'user_tag_icon',
          key: 'user_tag_icon'
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
      confirmDirty: false,
      modal_visible_edit: false,
      modal_visible_authority: false,
      is_create: true,
      menu_text: ['', '图片', '字体图标']
    }
  }

  componentDidMount () {
    this.fetch_user_tag_list()
  }

  _edit = (data) => {/*修改标签*/
    this.setState({
      modal_visible_edit: true,
      is_create: false
    })
    this.props.dispatch({type: 'SET_USER_TAG_INFO', data: data})
    this.props.form.setFieldsValue({
      user_tag_name: data.user_tag_name,
      user_tag_icon: data.user_tag_icon,
      user_tag_icon_type: this.state.menu_text[data.user_tag_icon_type],
      user_tag_description: data.user_tag_description
    })
  }

  _delete = (value) => {
    this.props.dispatch({type: 'SET_USER_TAG_INFO', data: value})
    confirm({
      title: '确认要删除此标签吗？',
      content: '此操作不可逆转',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.fetch_delete_user_tag({user_tag_id: this.props.state_user_tag.current_info.user_tag_id})
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
    this.fetch_user_tag_list(pages)
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
          this.fetch_create_user_tag(values)
        } else {
          this.fetch_update_user_tag(values)
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

  fetch_create_user_tag = (values) => {  /*创建标签*/
    this.props.dispatch(create_user_tag(values, (res) => {
      alert.message_success('创建标签成功')
      this.fetch_user_tag_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_update_user_tag = (values) => { /*修改标签*/
    this.props.dispatch(update_user_tag({user_tag_id: this.props.state_user_tag.current_info.user_tag_id, ...values}, (res) => {
      alert.message_success('修改标签成功')
      this.fetch_user_tag_list()
      this.setState({
        modal_visible_edit: false
      })
    }))
  }

  fetch_delete_user_tag = (values) => { /*删除管理员用户*/
    this.props.dispatch(delete_user_tag(values, (res) => {
      alert.message_success('删除标签成功')
      this.fetch_user_tag_list()
    }))
  }

  fetch_user_tag_list = () => {  /*获取管理员用户带分页的列表*/
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_user_tag_list({params: {page: current}}, (res) => {
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
    const {state_user_tag} = this.props
    const {loading, is_create} = this.state
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
          <h2><strong>标签管理</strong></h2>
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
            <Button
              className="article-tag-user-create-btn"
              icon="plus" type="primary"
              onClick={() => this.showModal(0)}
            >创建标签</Button>
            {/*<p>{this.props.match.url}</p>
          <p>{this.props.match.params.id}</p>*/}

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
                  label="标签名"
                >
                  {getFieldDecorator('user_tag_name', {
                    rules: [{required: true, message: '请输入标签名！', whitespace: true}]
                  })(
                    <Input placeholder="标签名"/>
                  )}
                </FormItem>


                <FormItem
                  {...formItemLayout}
                  label="标签名图标"
                >
                  {getFieldDecorator('user_tag_icon', {
                    rules: [{required: true, message: '请输入标签名图标！', whitespace: true}]
                  })(
                    <Input placeholder="标签名图标"/>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="标签图标类型"
                >
                  {getFieldDecorator('user_tag_icon_type', {
                    rules: [
                      {required: true, message: '请选择标签图标类型！'}
                    ]
                  })(
                    <Select placeholder="标签图标类型！">
                      <Option value="1">图片</Option>
                      <Option value="2">字体图标</Option>
                    </Select>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="标签描述"
                >
                  {getFieldDecorator('user_tag_description', {
                    rules: [{required: true, message: '请输入标签描述'}]
                  })(
                    <TextArea placeholder="请输入标签描述" type="text"/>
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
                    {
                      is_create ? '创建标签' : '更新'
                    }
                  </Button>
                </FormItem>
              </Form>
            </Modal>

            <Table
              columns={this.state.columns}
              dataSource={state_user_tag.list}
              loading={loading}
              onChange={this.TablePageChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="user_tag_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const UserTagForm = Form.create()(UserTag)

export default connect(({state_user_tag}) => {
  return {
    state_user_tag
  }
})(UserTagForm)

