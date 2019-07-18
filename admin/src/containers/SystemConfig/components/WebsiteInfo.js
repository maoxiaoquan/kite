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

import { get_system_config_info, update_system_config_info } from '../actions'
import alert from '../../../utils/alert'

import { get_user_role_all } from '../../UserRole/actions/UserRoleAction'

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
      loading: false
    }
  }

  async componentDidMount() {
    this.system_config_info()
  }

  async system_config_info() {
    await this.props.dispatch(
      get_system_config_info({}, result => {
        this.props.form.setFieldsValue({
          ...result.website
        })
      })
    )
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let {
          service,
          user,
          pass,
          website_name,
          domain_name,
          keywords,
          introduction,
          description,
          miibeian,
          about,
          feedback,
          logo
        } = values
        this.props.dispatch(
          update_system_config_info(
            {
              type: 'website',
              website: {
                website_name,
                domain_name,
                keywords,
                introduction,
                description,
                miibeian,
                about,
                feedback,
                logo
              }
            },
            result => {
              this.system_config_info()
              this.setState({
                is_edit: false
              })
            }
          )
        )
      }
    })
  }

  render() {
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
          <Icon type="setting" /> <em>网站配置</em>
        </div>

        <div className="layout-nav-btn" />

        <div className="layout-card-view">
          <div className="sc-content-view">
            <Form className="from-view" onSubmit={this.handleSubmit.bind(this)}>
              <FormItem {...formItemLayout} label="网站名">
                {getFieldDecorator('website_name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入网站名！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="网站名" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="logo地址">
                {getFieldDecorator('logo', {
                  rules: [
                    {
                      message: '请输入logo！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="logo" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="域名">
                {getFieldDecorator('domain_name', {
                  rules: [
                    {
                      message: '请输入域名！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="域名" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="网站介绍">
                {getFieldDecorator('introduction', {
                  rules: [
                    {
                      message: '请输入网站介绍！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="网站介绍" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="网站关键词">
                {getFieldDecorator('keywords', {
                  rules: [
                    {
                      message: '请输入网站关键词！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="网站关键词" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="网站描述">
                {getFieldDecorator('description', {
                  rules: [
                    {
                      message: '请输入网站描述！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="网站介绍" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="备案号">
                {getFieldDecorator('miibeian', {
                  rules: [
                    {
                      message: '请输入备案号！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="备案号" />)}
              </FormItem>

              <h3 className="title">侧栏底部信息</h3>

              <FormItem {...formItemLayout} label="关于">
                {getFieldDecorator('about', {
                  rules: [
                    {
                      message: '请输入关于！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="关于" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="建议反馈">
                {getFieldDecorator('feedback', {
                  rules: [
                    {
                      message: '请输入建议反馈！',
                      whitespace: true
                    }
                  ]
                })(<Input disabled={!is_edit} placeholder="建议反馈" />)}
              </FormItem>

              <FormItem {...tailFormItemLayout}>
                {!is_edit ? (
                  <Button
                    className="edit-btn"
                    onClick={() => {
                      this.setState({
                        is_edit: true
                      })
                    }}
                    type="primary"
                  >
                    修改
                  </Button>
                ) : (
                  <div>
                    <Button
                      className="enter-btn"
                      htmlType="submit"
                      type="primary"
                      style={{ marginRight: '10px' }}
                    >
                      确定
                    </Button>

                    <Button
                      className="cancel-btn"
                      onClick={() => {
                        this.setState({
                          is_edit: false
                        })
                      }}
                      type="primary"
                    >
                      取消
                    </Button>
                  </div>
                )}
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
