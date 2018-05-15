import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'

import { sign_up } from '../actions/index'

import './signup.scss'
import alert from '../../../utils/alert'

const FormItem = Form.Item

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.props.dispatch(sign_up(values, (res) => {
          if (res.state === 'success') {
            alert.message_error(res.message)
            this.props.history.push('/sign_in')
          } else {
            alert.message_error(res.message)
          }
        }))
      }
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value
    this.setState({confirmDirty: this.state.confirmDirty || !!value})
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致！')
    } else {
      callback()
    }
  }
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true})
    }
    callback()
  }

  render () {
    const {getFieldDecorator} = this.props.form
    const {autoCompleteResult} = this.state

    return (
      <div id="admin-sign-up">
        <div className="admin-sign-up-view">

          <div className="admin-sign-up-header">
            <ul>
              <li><i className="fa fa-circle"></i></li>
              <li><i className="fa fa-circle"></i></li>
              <li><i className="fa fa-circle"></i></li>
            </ul>
          </div>

          <h3 className="title">注册</h3>

          <Form className="from-view"
                onSubmit={this.handleSubmit}
          >

            <FormItem>
              {getFieldDecorator('account', {
                rules: [{required: true, message: '请输入账户！', whitespace: true}]
              })(
                <Input placeholder="账户"/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码！'
                }, {
                  validator: this.validateToNextPassword
                }]
              })(
                <Input placeholder="密码"
                       type="password"
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '重复输入密码！'
                }, {
                  validator: this.compareToFirstPassword
                }]
              })(
                <Input onBlur={this.handleConfirmBlur}
                       placeholder="重复密码"
                       type="password"
                />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '输入的电子邮件无效！'
                }, {
                  required: true, message: '请输入您的电子邮件！'
                }]
              })(
                <Input placeholder="邮箱"/>
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked'
              })(
                <Checkbox> <span className="font-co1">我同意</span> <a href="">注册条约</a></Checkbox>
              )}
            </FormItem>
            <FormItem>
              <Button
                className="register-btn"
                htmlType="submit"
                type="primary"
              >注册</Button>
              <span className="font-co1">  已注册，</span>
              <Link to="/sign_in">登录</ Link>
            </FormItem>
          </Form>
        </div>
      </div>

    )
  }
}

const SignUp = Form.create()(RegistrationForm)

export default connect((title) => {
  console.log('title', title.title.title)
  return {
    title
  }
})(SignUp)
