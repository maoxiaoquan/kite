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

import { getSystemConfigInfo, updateSystemConfigInfo } from '../actions'
import alert from '../../../utils/alert'

import { getUserRoleAll } from '../../UserRole/actions/UserRoleAction'

const Option = Select.Option
const FormItem = Form.Item
const confirm = Modal.confirm

@connect(({ stateSystemConfig }) => {
  return {
    stateSystemConfig
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
      getSystemConfigInfo({}, result => {
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
          updateSystemConfigInfo(
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
          <h4 class="header-title">网站配置</h4>
        </div>

        <div className="layout-nav-btn" />

        <div className="card layout-card-view">
          <div className="card-body sc-content-view">
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
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      this.setState({
                        is_edit: true
                      })
                    }}
                    type="primary"
                  >
                    修改
                  </button>
                ) : (
                  <div>
                    <button
                      className="btn btn-primary"
                      type="primary"
                      style={{ marginRight: '10px' }}
                    >
                      确定
                    </button>

                    <button
                      className="btn btn-light"
                      onClick={() => {
                        this.setState({
                          is_edit: false
                        })
                      }}
                      type="primary"
                    >
                      取消
                    </button>
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
