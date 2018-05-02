import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';

import alert from '../../../utils/alert'

import { sign_in } from '../actions/index'

import './signin.scss';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch(sign_in(values, (res) => {
          console.log('666',res)
          if (res.state === 'success') {
            console.log('res.token', res.token)
            localStorage.box_tokens = res.token;
            this.props.history.push('/')
          } else {
            alert.message_error(res.message)
          }
        }))
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div id="admin-sign-in">
        <div className="admin-sign-in-view">

          <div className="admin-sign-in-header">
            <ul>
              <li><i className="fa fa-circle"></i></li>
              <li><i className="fa fa-circle"></i></li>
              <li><i className="fa fa-circle"></i></li>
            </ul>
          </div>

          <h3 className="title">登录</h3>

          <Form className="from-view"
            onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入你的账户！' }]
              })(
                <Input placeholder="账户"
                  prefix={<Icon type="user" />}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码！' }]
              })(
                <Input placeholder="密码"
                  prefix={<Icon type="lock" />}
                  type="password"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(
                <Checkbox><span className="font-co1">记住密码，</span></Checkbox>
              )}
              <a className="login-form-forgot"
                href=""
              >找回密码</a>
              <Button className="sign-in-btn"
                htmlType="submit"
                type="primary"
              >
                登录
              </Button>
              <span className="font-co1">已登录，</span>
              <Link to="/sign_up">注册</ Link>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const SignIn = Form.create()(NormalLoginForm);

export default connect((title) => {
  console.log('title', title.title.title);
  return {
    title
  };
})(SignIn);
