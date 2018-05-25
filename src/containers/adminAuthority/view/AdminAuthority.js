import React from 'react'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button, Checkbox, Select, Table, Modal, InputNumber } from 'antd'
import { Link } from 'react-router-dom'
import alert from '../../../utils/alert'
import './AdminAuthority.scss'
import { create_admin_role, get_admin_role_list } from '../action/AdminAuthorityAction'

const FormItem = Form.Item
const Option = Select.Option

class AdminAuthority extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '角色id',
          dataIndex: 'role_id',
          key: 'role_id'
        },
        {
          title: '角色名字',
          dataIndex: 'role_name',
          key: 'role_name'
        },
        {
          title: '角色描述',
          dataIndex: 'role_description',
          key: 'role_description'
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => {
            return (
              <div>
                <a href="javascript:;">Action 一 {record.name}</a>
                <a href="javascript:;">Delete</a>
                <a className="ant-dropdown-link" href="javascript:;">More actions <Icon type="down"/></a>
              </div>
            )
          }
        }],
      pagination: {},
      loading: false,
      visible: false,
      authority_type_select: 1
    }
  }

  componentDidMount () {
    this.fetch_admin_role_list()
  }

  showModal = () => {
    this.props.form.resetFields()
    this.setState({
      visible: true
    })
    /*this.props.form.setFieldsValue({
      authority_name: '666',
      authority_type: '基础菜单',
      authority_url: '666',
      authority_sort: 8,
      authority_description: '666'
    })*/
  }
  handleOk = () => {
    let params = {
      role_name: this.state.role_name,
      role_description: this.state.role_description
    }
    this.setState({
      visible: false
    })
    this.props.dispatch(create_admin_role(params, () => {
      alert.message_success('角色创建成功')
      this.fetch_admin_role_list()
    }))
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  authority_type_Change = (value) => {
    this.setState({
      authority_type_select: value
    })
  }

  handleTableChange = async (pages) => {
    let pagination = {}
    pagination.current = pages.current
    await this.setState({
      pagination: {
        current: pages.current
      }
    })

    this.fetch_admin_role_list()
  }

  fetch_admin_role_list = () => {
    const that = this
    this.setState({loading: true})
    const {pagination: {current}} = this.state
    this.props.dispatch(get_admin_role_list({params: {page: current}}, (res) => {
      let pagination = {...that.state.pagination}
      pagination.total = res.count
      pagination.current = current
      that.setState({
        loading: false,
        pagination
      })
    }))
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      await  this.props.dispatch({type: 'SER_AUTHORITY_FORM', data: values})
      console.log('authority_form', this.props.admin_authority.authority_form)
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render () {
    const {admin_authority} = this.props
    const {getFieldDecorator} = this.props.form
    const {loading, authority_type_select} = this.state

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
          <h2><strong>权限管理</strong></h2>
          <ul className="header-dropdown">
            <li className="dropdown">
              <a className="dropdown-toggle" href="javascript:void(0);">
                <Icon type="ellipsis"/>
              </a>
            </li>
          </ul>
        </div>
        <div className="box-card-body">
          <div className="admin-authority">
            <Button className="admin-authority-create-btn" icon="plus" onClick={this.showModal}
                    type="primary">创建权限</Button>
            <Modal
              footer={null}
              onCancel={this.handleCancel}
              onOk={this.handleOk}
              title="创建权限"
              visible={this.state.visible}
            >
              <Form className="login-form" onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限名称"
                >
                  {getFieldDecorator('authority_name', {
                    rules: [{required: true, message: '请输入权限名称'}]
                  })(
                    <Input type="text"/>
                  )}
                </FormItem>

                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限类型"
                >
                  {getFieldDecorator('authority_type', {
                    rules: [
                      {required: true, message: '请选择权限类型！'}
                    ]
                  })(
                    <Select onChange={this.authority_type_Change} placeholder="请选择权限类型！">
                      <Option value="1">基础菜单</Option>
                      <Option value="2">操作和功能</Option>
                    </Select>
                  )}
                </FormItem>

                {
                  Number(authority_type_select) === 1 ? (
                      <FormItem
                        {...formItemLayout}
                        hasFeedback
                        label="权限路径"
                      >
                        {getFieldDecorator('authority_url', {
                          rules: [{required: true, message: '请输入权限路径'}]
                        })(
                          <Input addonBefore="/api/" placeholder="请输入权限路径" type="text"/>
                        )}
                      </FormItem>
                    )
                    : (
                      <FormItem
                        {...formItemLayout}
                        hasFeedback
                        label="权限路径"
                      >
                        {getFieldDecorator('authority_url', {
                          rules: [{required: true, message: '请输入权限路径'}]
                        })(
                          <Input placeholder="请输入权限路径" type="text"/>
                        )}
                      </FormItem>
                    )
                }


                <FormItem
                  {...formItemLayout}
                  label="排序"
                >
                  {getFieldDecorator('authority_sort', {initialValue: 3})(
                    <InputNumber max={10} min={1}/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  hasFeedback
                  label="权限描述"
                >
                  {getFieldDecorator('authority_description', {
                    rules: [{required: true, message: '请输入权限描述'}]
                  })(
                    <Input placeholder="请输入权限描述" type="text"/>
                  )}
                </FormItem>
                <FormItem
                  {...tailFormItemLayout}
                >
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    提交
                  </Button>
                  <Button onClick={this.handleReset} style={{marginLeft: 8}}>
                    重置
                  </Button>
                </FormItem>
              </Form>

            </Modal>


            <Table
              columns={this.state.columns}
              dataSource={admin_authority.admin_role_list}
              loading={loading}
              onChange={this.handleTableChange.bind(this)}
              pagination={this.state.pagination}
              rowKey="role_id"
            />
          </div>
        </div>
      </div>
    )
  }
}

const AdminAuthorityForm = Form.create()(AdminAuthority)

export default connect(({admin_authority}) => {
  return {
    admin_authority
  }
})(AdminAuthorityForm)

