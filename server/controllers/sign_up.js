const db = require('../db/db')
const {checkEmail, checkPhoneNum} = require('../utils/validators')
const moment = require('moment')
const sendMail = require('../utils/send_email')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class sign_up {
  constructor () {
    this.sign_up_state = {
      title: 'sign_up'
    }
  }

  async get_sign_up (ctx) { // get 页面

    const title = 'sign_up'

    if (ctx.session.islogin) {
      ctx.redirect('/')
    } else {
      await ctx.render('default/sign_up', {
        title: title,
        status: 1,
        message: '',
        data: {}
      })
    }
  }

  async post_sign_up (ctx) { // post 数据
    let req_data = {
      nickname: ctx.request.body.nickname,
      account: ctx.request.body.account,
      password: ctx.request.body.password,
      double_password: ctx.request.body.double_password
    }

    try {
      if (!req_data.nickname) {
        console.log('req_data', req_data)
        throw  new err_mess('昵称不存在')
      }
      if (!req_data.account) {
        throw  new err_mess('账户不存在')
      }
      if (!req_data.password) {
        throw  new err_mess('密码不存在')
      }
      if (req_data.password !== req_data.double_password) {
        throw  new err_mess('两次输入密码不一致')
      }
    } catch (err) {
      ctx.body = {
        status: 2,
        message: err.message,
        data: {}
      }
      return false
    }

    if (checkEmail(req_data.account)) { /*邮箱注册*/

      try {
        let email = await db.user.findOne({
          where: {
            email: req_data.account
          }
        })
        if (!email) {

          await db.user.create({
            nickname: req_data.nickname,
            password: req_data.password,
            email: req_data.account,
            sex: '未知',
            reg_ip: ctx.request.ip,
            last_sign_ip: '',
            reg_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            last_sign_time: ''
          }).then(function (data) {

            sendMail('838115837@qq.com', `${req_data.nickname},注册成功，跳往登录页`, 'Hi Amor,这是一封测试邮件')
            console.log('created.' + JSON.stringify(data))
            ctx.body = {
              state: 1,
              message: '注册成功，跳往登录页'
            }
          }).catch(function (err) {
            console.log('err.' + err)
            ctx.body = {
              state: 2,
              message: err
            }
          })

        } else {
          ctx.body = {
            state: 2,
            message: '邮箱已存在'
          }
        }

      } catch (err) {
        ctx.body = {
          state: 2,
          type: 'ERROR_IN_SAVE_DATA',
          message: err
        }
      }

    } else if (checkPhoneNum(req_data.account)) {  /* 手机号码注册*/

      ctx.body = {
        state: 2,
        message: '暂时未开放手机号码注册'
      }

    } else {        /* 非手机号码非邮箱*/
      ctx.body = {
        state: 2,
        message: '请输入正确的手机号码或者邮箱'
      }
    }
  }

}

module.exports = new sign_up()