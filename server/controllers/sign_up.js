const db = require('../db/db')
const {checkEmail, checkPhoneNum} = require('../utils/validators')
const moment = require('moment')
const sendMail = require('../utils/send_email')
const {random_number, tools} = require('../utils')
const config = require('../../config')

const {query_user_verify_code} = require('../sql_server/query')

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
        state: 'success',
        message: '',
        data: {}
      })
    }
  }

  async post_sign_up_code (ctx) {

    let req_data = ctx.request.body
    if (checkEmail(req_data.account)) { /*邮箱注册*/

      try {
        let email = await db.user.findOne({
          where: {
            email: req_data.account
          }
        })
        if (!email) {

          let random = random_number(true, 5, 8)
          await db.user_verify_code.create({
            phone: '',
            email: req_data.account,
            verify_code: random,
            expire_time: moment().utc().zone(+8).format('X')
          }).then(function (data) {
            sendMail('838115837@qq.com', '验证码成功发送', random)
            ctx.body = {
              state: 'success',
              message: '验证码已发送到邮箱'
            }
          }).catch(function (err) {
            ctx.body = {
              state: 'error',
              message: err
            }
          })

        } else {
          ctx.body = {
            state: 'error',
            message: '邮箱已存在'
          }
        }

      } catch (err) {
        ctx.body = {
          state: 'error',
          type: 'ERROR_IN_SAVE_DATA',
          message: err
        }
      }

    } else if (checkPhoneNum(req_data.account)) {  /* 手机号码注册*/

      ctx.body = {
        state: 'error',
        message: '暂时未开放手机号码注册'
      }

    } else {        /* 非手机号码非邮箱*/
      ctx.body = {
        state: 'error',
        message: '请输入正确的手机号码或者邮箱'
      }
    }

  }

  async post_sign_up (ctx) { // post 数据
    let req_data = ctx.request.body

    try {
      if (!req_data.nickname) {
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

      if (!req_data.code) {
        throw  new err_mess('验证码不存在')
      }

    } catch (err) {
      ctx.body = {
        state: 'error',
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
          
          await query_user_verify_code(req_data.account).then((data) => {
            if (data.length > 0) {
              ctx.body = {
                state: 'error',
                message: '请发送验证码2',
                data: {}
              }
              return false
            } else {
              ctx.body = {
                state: 'error',
                message: '请发送验证码3',
                data: {}
              }
              return false
            }
          })

          /*if (data.length > 0) {
            let time_num = moment().utc().utcOffset(+8).format('X')
            if (req_data.code === data[0].verify_code) {
              if ((Number(time_num) - Number(data[0].expire_time)) > (30 * 60 * 60 * 1000)) {
                ctx.body = {
                  state: 'error',
                  message: '验证码超时，请再次获取',
                  data: {}
                }
              }

            } else {

              ctx.body = {
                state: 'error',
                message: '验证码错误',
                data: {}
              }
            }

          } else {
            ctx.body = {
              state: 'error',
              message: '请发送验证码',
              data: {}
            }
          }
*/
          return false

          db.user.create({
            nickname: req_data.nickname,
            password: tools.encrypt(req_data.password, config.encrypt_key),
            email: req_data.account,
            sex: '未知',
            reg_ip: ctx.request.ip,
            last_sign_ip: '',
            reg_time: moment().utc().utcOffset(+8).format('X'),
            last_sign_time: ''
          }).then(function (data) {
            console.log('data6666666666', ctx)
            sendMail('838115837@qq.com', `${req_data.nickname}，您好，注册成功`, `<h2>${req_data.nickname}</h2><p>账户已注册成功</p>`)
            ctx.body = {
              state: 'success',
              message: '注册成功，跳往登录页'
            }
          }).catch(function (err) {
            ctx.body = {
              state: 'error',
              message: err
            }
          })

        } else {
          ctx.body = {
            state: 'error',
            message: '邮箱已存在'
          }
        }

      } catch (err) {
        ctx.body = {
          state: 'error',
          type: 'ERROR_IN_SAVE_DATA',
          message: err
        }
      }

    } else if (checkPhoneNum(req_data.account)) {  /* 手机号码注册*/

      ctx.body = {
        state: 'error',
        message: '暂时未开放手机号码注册'
      }

    } else {        /* 非手机号码非邮箱*/
      ctx.body = {
        state: 'error',
        message: '请输入正确的手机号码或者邮箱'
      }
    }
  }

}

module.exports = new sign_up()