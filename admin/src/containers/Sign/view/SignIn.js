import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Checkbox, Button } from 'antd'

import alert from '../../../utils/alert'

import { sign_in } from '../actions/index'

import './signin.scss'

const FormItem = Form.Item

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(
          sign_in(values, res => {
            if (res.state === 'success') {
              localStorage.box_tokens = res.token
              this.props.history.push('/')
            } else {
              alert.message_error(res.message)
            }
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div id="admin-sign-in">
        <div className="admin-sign-in-view">
          <div className="admin-sign-in-header">
            <h2>Admin</h2>
          </div>

          <Form className="from-view" onSubmit={this.handleSubmit}>
            <FormItem hasFeedback>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入你的账户！' }]
              })(<Input placeholder="账户" prefix={<Icon type="user" />} />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }]
              })(
                <Input
                  placeholder="密码"
                  prefix={<Icon type="lock" />}
                  type="password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button className="sign-in-btn" htmlType="submit" type="primary">
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const SignIn = Form.create()(NormalLoginForm)

export default connect(state_title => {
  return {
    state_title
  }
})(SignIn)
