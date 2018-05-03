const db = require('../db/db')
const {checkEmail, checkPhoneNum} = require('../utils/validators')
const {tools} = require('../utils')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class sign_in {
  constructor (state) {
    this.state = {
      title: 'none'
    }
  }

  async get_sign_in (ctx) {  /*router to sign_in.ejs*/
    const title = 'sign_in'

    if (ctx.session.islogin) {
      ctx.redirect('/')
    } else {
      await ctx.render('default/sign_in', {
        title,
        state: 'success',
        meaasge: '',
        data: {
          account: '',
          password: ''
        }
      })
    }

  }

  async post_sign_in (ctx) {
    const title = 'sign_in'

    let formData = ctx.request.body

    try {
      if (!formData.account) {
        console.log('req_data', formData)
        throw  new err_mess('请输入账户')
      }
      if (!formData.password) {
        throw  new err_mess('请输入密码')
      }
    } catch (err) {
      await ctx.render('default/sign_in', {
        title: title,
        state: 'error',
        message: err.message,
        data: {
          account: formData.account,
          password: formData.password
        }
      })
      return false
    }

    if (checkEmail(formData.account)) { /*邮箱登录*/

      try {
        let sql_data_email = await db.user.findOne({
          where: {
            email: formData.account
          }
        })
        if (sql_data_email) {

          if (tools.encrypt(formData.password) === sql_data_email.dataValues.password) {

            let session = ctx.session
            session.islogin = true
            session.nickname = sql_data_email.dataValues.nickname
            session.user_id = sql_data_email.dataValues.user_id

            ctx.redirect('/')

          } else {
            await ctx.render('default/sign_in', {
              title: title,
              state: 'error',
              message: '密码错误',
              data: {
                account: formData.account,
                password: formData.password
              }
            })
          }

        } else {

          await ctx.render('default/sign_in', {
            title: title,
            state: 'error',
            message: '账户不存在',
            data: {
              account: formData.account,
              password: formData.password
            }
          })
        }

      } catch (err) {

        await ctx.render('default/sign_in', {
          title: title,
          state: 'error',
          message: err,
          data: {
            account: formData.account,
            password: formData.password
          }
        })
      }

    } else if (checkPhoneNum(formData.account)) {  /* 手机号码登录*/

      await ctx.render('default/sign_in', {
        title: title,
        state: 'error',
        message: '暂时未开放手机号码登录',
        data: {
          account: formData.account,
          password: formData.password
        }
      })

    } else {        /* 非手机号码非邮箱*/
      await ctx.render('default/sign_in', {
        title: title,
        state: 'error',
        message: '请输入正确的手机号码或者邮箱',
        data: {
          account: formData.account,
          password: formData.password
        }
      })
    }

  }

}

module.exports = new sign_in()