const {sequelize, user, user_info, verify_code, user_attention, user_like_article, subscribe_article_tag, article} = require('../models')
const {checkEmail, checkPhoneNum} = require('../utils/validators')
const moment = require('moment')
const {render, home_resJson} = require('../utils/res_data')
const {sendMail, send_verify_code_mail} = require('../utils/send_email')
const {random_number, tools} = require('../utils')
const config = require('../../config')

const {query_user_verify_code} = require('../sql/query')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class User {
  constructor () {
    this.sign_up_state = {
      title: 'sign'
    }
  }

  static async render_sign_in (ctx) {  /*router to sign_in.ejs*/
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

  static async esc_sign_in (ctx) {
    ctx.session = null
    ctx.redirect('/sign_in')
  }

  static async form_sign_in (ctx) {
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
        let sql_data_user = await user.findOne({
          where: {
            email: formData.account
          }
        })
        if (sql_data_user) {

          if (tools.encrypt(formData.password, config.encrypt_key) ===
            sql_data_user.dataValues.password) {

            let session = ctx.session
            session.islogin = true
            session.nickname = sql_data_user.dataValues.nickname
            session.uid = sql_data_user.dataValues.uid
            session.avatar = sql_data_user.dataValues.avatar

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

  /* get_sign_up start*/

  static async render_sign_up (ctx) { // get 页面

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

  static async post_sign_up_code (ctx) {

    let req_data = ctx.request.body
    if (checkEmail(req_data.account)) { /*邮箱注册验证码*/

      try {
        let email = await user.findOne({
          where: {
            email: req_data.account
          }
        })
        if (!email) {

          let random = random_number(true, 6, 6)

          await verify_code.create({
            phone: '',
            email: req_data.account,
            verify_code: random,
            expire_time: moment().utc().utcOffset(+8).format('X'),
            create_date: moment().utc().utcOffset(+8).format(), /*时间*/
          }).then(function (data) {

            send_verify_code_mail(req_data.account, '注册验证码', random)
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

  /**
   * 用户注册post
   * @param   {obejct} ctx 上下文对象
   */
  static async post_sign_up (ctx) { // post 数据
    let req_data = ctx.request.body

    try {
      if (!req_data.nickname) {
        throw new err_mess('昵称不存在')
      }
      if (!req_data.account) {
        throw new err_mess('账户不存在')
      }
      if (!req_data.password) {
        throw new err_mess('密码不存在')
      }
      if (req_data.password !== req_data.double_password) {
        throw new err_mess('两次输入密码不一致')
      }
      if (!req_data.code) {
        throw new err_mess('验证码不存在')
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

        let nickname_date = await user.findOne({
          where: {
            nickname: req_data.nickname
          }
        })

        if (nickname_date) {
          ctx.body = {
            state: 'error',
            message: '用户昵称已存在，请重新输入'
          }
          return false
        }

        let email = await user.findOne({
          where: {
            email: req_data.account
          }
        })

        try {
          if (!email) {

            await query_user_verify_code(req_data.account).then((data) => {  /*注册验证码验证*/
              if (data.length > 0) {
                let time_num = moment().utc().utcOffset(+8).format('X')
                if (req_data.code === data[0].verify_code) {

                  if ((Number(time_num) - Number(data[0].expire_time)) > (30 * 60)) {
                    throw new err_mess('验证码已过时，请再次发送')
                  }

                } else {
                  throw new err_mess('验证码错误')
                }

              } else {
                throw new err_mess('请发送验证码')
              }
            })

            let user_count = await user.count()

            await sequelize.transaction(function (transaction) {
              // 在事务中执行操作
              return user.create({
                /*注册写入数据库操作*/
                uid: Number(user_count) + 10000,
                avatar: 'http://oq33egsog.bkt.clouddn.com/avatar1.jpg',
                nickname: req_data.nickname,
                password: tools.encrypt(req_data.password, config.encrypt_key),
                email: req_data.account,
                sex: '未知',
                reg_ip: ctx.request.ip,
                reg_time: moment().utc().utcOffset(+8).format('X'),
                create_date_timestamp: moment().utc().utcOffset(+8).format('X') /*时间戳 */
              })
                .then(function (user) {
                  return user_info.create({
                    /*注册写入数据库操作*/
                    uid: user.uid
                  })
                })

            }).then(function (data) {
              sendMail(req_data.account, `${req_data.nickname}，您好，注册成功`, `<h2>${req_data.nickname}</h2><p>账户已注册成功</p>`)
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
            message: err.message
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

  /**
   * 获取用户信息post
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_info (ctx) {

    let uid = ctx.query.uid

    try {
      if (!uid) {
        throw new err_mess('uid为空')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    let findOne_user = await user.findOne({ //获取用户信息
      where: {uid},
      attributes: ['uid', 'avatar', 'nickname']
    })

    let user_attention_uid_arr = await user_attention.findAll({where: {uid}}).then((res) => {
      return res.map((attention_item, key) => {
        return attention_item.attention_uid
      })
    })

    let user_like_article_arr = await user_like_article.findAll({where: {uid}}).then((res) => {
      return res.map((user_like_article_item, key) => {
        return user_like_article_item.aid
      })
    })

    let subscribe_article_tag_arr = await subscribe_article_tag.findAll({where: {uid}}).then((res) => {
      return res.map((subscribe_article_tag_item, key) => {
        return subscribe_article_tag_item.article_tag_id
      })
    })

    let other_user_attention_count = await user_attention.count({ // 多少人关注了
      where: {
        attention_uid: uid
      }
    })

    let user_article_count = await article.count({ // 他有多少文章
      where: {
        uid
      }
    })

    home_resJson(ctx, {
      state: 'success',
      message: '获取用户所有信息成功',
      data: {
        user: findOne_user,
        attention_uid_arr: user_attention_uid_arr,
        user_like_aid_arr: user_like_article_arr,
        subscribe_article_tag_id_arr: subscribe_article_tag_arr,
        other_user_attention_count,
        user_article_count
      }
    })
  }

}

module.exports = User