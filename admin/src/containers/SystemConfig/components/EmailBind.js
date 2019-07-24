import React from 'react'
import { connect } from 'react-redux'
import {
  Icon,
  Modal,
  Button,
  Form,
  Input,
  Select
} from 'antd'
import { Link } from 'react-router-dom'

import {
  getSystemConfigInfo,
  updateSystemConfigInfo
} from '../actions'
import alert from '../../../utils/alert'

import {
  getUserRoleAll
} from '../../UserRole/actions/UserRoleAction'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@connect(({ state_system_config }) => {
  return {
    state_system_config
  }
})

class SystemConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      is_edit: false,
      loading: false,
      type: ''
    }
  }

  async componentDidMount () {
    this.system_config_info()
  }

  async system_config_info () {
    await this.props.dispatch(getSystemConfigInfo({}, result => {
      this.setState({
        type: result.email.type
      })
      this.props.form.setFieldsValue({
        ...result.email
      })
    }))
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch(updateSystemConfigInfo({
          type: 'email',
          email: {
            ...values
          }
        }, result => {
          this.system_config_info()
          this.setState({
            is_edit: false
          })
        }))
      }
    })
  }

  render () {
    const { is_edit } = this.state
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
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
          offset: 8
        }
      }
    }
    return (

      <div className="layout-main" id="system-config">

        <div className="layout-main-title">
          <Icon type="setting" /> <em>邮箱修改or绑定</em>
        </div>

        <div className="layout-nav-btn">

        </div>

        <div className="layout-card-view">

          <div className="sc-content-view">
            <Form
              className="from-view"
              onSubmit={this.handleSubmit.bind(this)}
            >
              <FormItem
                {...formItemLayout}
                label="系统类型"
              >
                {getFieldDecorator('type', {
                  rules: [{
                    required: true,
                    message: '请输入系统类型！',
                    whitespace: true
                  }]
                })(
                  <Select disabled={!is_edit} onChange={(value) => {
                    this.setState({
                      type: value
                    })
                  }}>
                    <Option value="company">企业</Option>
                    <Option value="personal">个人</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="系统邮箱"
              >
                {getFieldDecorator('user', {
                  rules: [{
                    required: true,
                    message: '请输入系统邮箱！',
                    whitespace: true
                  }]
                })(
                  <Input disabled={!is_edit} placeholder="邮箱" />
                )}
              </FormItem>
              {
                this.state.type === 'company' ?
                  (
                    <div>
                      <FormItem
                        {...formItemLayout}
                        label="服务商服务器地址"
                      >
                        {getFieldDecorator('host', {
                          rules: [{
                            required: true,
                            message: '请输入服务商服务器地址！',
                            whitespace: true
                          }]
                        })(
                          <Input disabled={!is_edit} placeholder="服务器地址" />
                        )}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label="系统邮箱服务商端口"
                      >
                        {getFieldDecorator('port', {
                          rules: [{
                            required: true,
                            message: '请输入系统邮箱服务商端口！',
                            whitespace: true
                          }]
                        })(
                          <Input disabled={!is_edit} placeholder="服务商端口" />
                        )}
                      </FormItem>
                    </div>
                  ) :
                  (<FormItem
                    {...formItemLayout}
                    label="系统邮箱服务商后缀"
                  >
                    {getFieldDecorator('service', {
                      rules: [{
                        required: true,
                        message: '请输入邮箱服务商后缀！',
                        whitespace: true
                      }]
                    })(
                      <Input disabled={!is_edit} placeholder="（例如：qq、163等等）" />
                    )}
                  </FormItem>
                  )
              }

              <FormItem
                {...formItemLayout}
                label="系统邮箱密码"
              >
                {getFieldDecorator('pass', {
                  rules: [{
                    required: true,
                    message: '请输入邮箱密码！',
                    whitespace: true
                  }]
                })(
                  <Input disabled={!is_edit} type="password" placeholder="邮箱密码" />
                )}
              </FormItem>

              <FormItem
                {...tailFormItemLayout}
              >
                {
                  !is_edit ? (
                    <Button
                      className="edit-btn"
                      onClick={() => {
                        this.setState({
                          is_edit: true
                        })
                      }}
                      type="primary"
                    >修改</Button>
                  ) : (
                      <div>
                        <Button
                          className="enter-btn"
                          htmlType="submit"
                          type="primary"
                          style={{ 'marginRight': '10px' }}
                        >确定</Button>

                        <Button
                          className="cancel-btn"
                          onClick={() => {
                            this.system_config_info()
                            this.setState({
                              is_edit: false
                            })
                          }}
                          type="primary"
                        >取消</Button>
                      </div>
                    )
                }
              </FormItem>
            </Form>
          </div>

        </div>
      </div>
    )
  }
}

const SystemConfigForm = Form.create()(SystemConfig)

export default SystemConfigForm
