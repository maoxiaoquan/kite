const models = require('../../../db/mysqldb/index')
const {
  checkEmail,
  checkPhoneNum,
  checkUrl,
  checkPwd
} = require('../../utils/validators')
const moment = require('moment')
const { render, home_resJson } = require('../../utils/res_data')
const { sendMail, send_verify_code_mail } = require('../../utils/send_email')
const { random_number, tools } = require('../../utils/index')
const config = require('../../../config')
const Op = require('sequelize').Op

const { query_user_verify_code } = require('../../sql/query')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class User {
  constructor() {
    this.sign_up_state = {
      title: 'sign'
    }
  }

  static async render_sign_in(ctx) {
    /*router to sign_in.html*/
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

  static async esc_sign_in(ctx) {
    ctx.session = null
    ctx.redirect('/sign_in')
  }

  static async form_sign_in(ctx) {
    const title = 'sign_in'

    let formData = ctx.request.body

    try {
      if (!formData.account) {
        console.log('req_data', formData)
        throw new err_mess('请输入账户')
      }
      if (!formData.password) {
        throw new err_mess('请输入密码')
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

    if (checkEmail(formData.account)) {
      /*邮箱登录*/

      try {
        let sql_data_user = await models.user.findOne({
          where: {
            email: formData.account
          }
        })
        if (sql_data_user) {
          if (
            tools.encrypt(formData.password, config.encrypt_key) ===
            sql_data_user.dataValues.password
          ) {
            let session = ctx.session
            session.islogin = true
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
    } else if (checkPhoneNum(formData.account)) {
      /* 手机号码登录*/

      await ctx.render('default/sign_in', {
        title: title,
        state: 'error',
        message: '暂时未开放手机号码登录',
        data: {
          account: formData.account,
          password: formData.password
        }
      })
    } else {
      /* 非手机号码非邮箱*/
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

  static async render_sign_up(ctx) {
    // get 页面

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

  // 注册验证码发送

  static async post_sign_up_code(ctx) {
    let req_data = ctx.request.body
    if (checkEmail(req_data.account)) {
      /*邮箱注册验证码*/

      try {
        let email = await models.user.findOne({
          where: {
            email: req_data.account
          }
        })
        if (!email) {
          let random = random_number(true, 6, 6)

          await models.verify_code
            .create({
              phone: '',
              email: req_data.account,
              verify_code: random,
              type: 'sign_up',
              expire_time: moment()
                .utc()
                .utcOffset(+8)
                .format('X'),
              create_date: moment()
                .utc()
                .utcOffset(+8)
                .format() /*时间*/
            })
            .then(function(data) {
              send_verify_code_mail(req_data.account, '注册验证码', random)
              ctx.body = {
                state: 'success',
                message: '验证码已发送到邮箱'
              }
            })
            .catch(function(err) {
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
    } else if (checkPhoneNum(req_data.account)) {
      /* 手机号码注册*/

      ctx.body = {
        state: 'error',
        message: '暂时未开放手机号码注册'
      }
    } else {
      /* 非手机号码非邮箱*/
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
  static async post_sign_up(ctx) {
    // post 数据
    let req_data = ctx.request.body

    try {
      if (!req_data.nickname) {
        throw new err_mess('昵称不存在')
      }
      if (req_data.nickname.length > 20) {
        throw new err_mess('昵称过长')
      }
      if (!req_data.account) {
        throw new err_mess('账户不存在')
      }
      if (!req_data.password) {
        throw new err_mess('密码不存在')
      }
      if (!checkPwd(req_data.password)) {
        throw new err_mess('密码格式输入有误!')
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

    if (checkEmail(req_data.account)) {
      /*邮箱注册*/

      try {
        let nickname_date = await models.user.findOne({
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

        let email = await models.user.findOne({
          where: {
            email: req_data.account
          }
        })

        try {
          if (!email) {
            await query_user_verify_code(req_data.account).then(data => {
              /*注册验证码验证*/
              if (data.length > 0) {
                let time_num = moment()
                  .utc()
                  .utcOffset(+8)
                  .format('X')
                if (req_data.code === data[0].verify_code) {
                  if (
                    Number(time_num) - Number(data[0].expire_time) >
                    30 * 60
                  ) {
                    throw new err_mess('验证码已过时，请再次发送')
                  }
                } else {
                  throw new err_mess('验证码错误')
                }
              } else {
                throw new err_mess('请发送验证码')
              }
            })

            let user_count = await models.user.count() || 0

            await models.sequelize
              .transaction(function(transaction) {
                let num = Number(user_count) + 10000
                // 在事务中执行操作
                return models.user
                  .create({
                    /*注册写入数据库操作*/
                    uid: num || 10000,
                    avatar: 'http://oq33egsog.bkt.clouddn.com/avatar1.jpg',
                    nickname: req_data.nickname,
                    password: tools.encrypt(
                      req_data.password,
                      config.encrypt_key
                    ),
                    email: req_data.account,
                    sex: 0,
                    reg_ip: ctx.request.ip
                  })
                  .then(function(user) {
                    return models.user_info.create({
                      /*注册写入数据库操作*/
                      uid: num
                    })
                  })
              })
              .then(function(data) {
                sendMail(
                  req_data.account,
                  `${req_data.nickname}，您好，注册成功`,
                  `<h2>${req_data.nickname}</h2><p>账户已注册成功</p>`
                )
                ctx.body = {
                  state: 'success',
                  message: '注册成功，跳往登录页'
                }
              })
              .catch(function(err) {
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
    } else if (checkPhoneNum(req_data.account)) {
      /* 手机号码注册*/

      ctx.body = {
        state: 'error',
        message: '暂时未开放手机号码注册'
      }
    } else {
      /* 非手机号码非邮箱*/
      ctx.body = {
        state: 'error',
        message: '请输入正确的手机号码或者邮箱'
      }
    }
  }

  /**
   * 获取用户信息get
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_info(ctx) {
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

    let findOne_user = await models.user.findOne({
      //获取用户信息
      where: { uid },
      attributes: [
        'uid',
        'avatar',
        'nickname',
        'sex',
        'introduction',
        'user_tag_ids'
      ]
    })

    let findOne_user_info = await models.user_info.findOne({
      //获取用户信息
      where: { uid }
    })

    let user_attention_uid_arr = await models.user_attention
      .findAll({ where: { uid } })
      .then(res => {
        return res.map((attention_item, key) => {
          return attention_item.attention_uid
        })
      })

    let user_like_article_arr = await models.user_like_article
      .findAll({ where: { uid } })
      .then(res => {
        return res.map((user_like_article_item, key) => {
          return user_like_article_item.aid
        })
      })

    let subscribe_article_tag_arr = await models.subscribe_article_tag
      .findAll({ where: { uid } })
      .then(res => {
        return res.map((subscribe_article_tag_item, key) => {
          return subscribe_article_tag_item.article_tag_id
        })
      })

    let other_user_attention_count = await models.user_attention.count({
      // 多少人关注了
      where: {
        attention_uid: uid
      }
    })

    let user_article_count = await models.article.count({
      // 他有多少文章
      where: {
        uid
      }
    })

    home_resJson(ctx, {
      state: 'success',
      message: '获取用户所有信息成功',
      data: {
        user: findOne_user,
        user_info: findOne_user_info,
        attention_uid_arr: user_attention_uid_arr,
        user_like_aid_arr: user_like_article_arr,
        subscribe_article_tag_id_arr: subscribe_article_tag_arr,
        other_user_attention_count,
        user_article_count
      }
    })
  }

  /**
   * 修改用户信息post
   * @param   {obejct} ctx 上下文对象
   */

  static async post_update_user_info(ctx) {
    let req_data = ctx.request.body

    let nickname_date = await models.user.findOne({
      where: {
        nickname: req_data.nickname,
        uid: {
          [Op.ne]: ctx.session.uid
        }
      }
    })

    try {
      if (req_data.nickname && req_data.nickname.length > 20) {
        throw new err_mess('昵称过长')
      }

      if (nickname_date) {
        throw new err_mess('用户昵称已存在，请重新输入')
      }

      if (req_data.introduction && req_data.introduction.length > 50) {
        throw new err_mess('个人介绍过长')
      }

      if (req_data.profession && req_data.profession.length > 20) {
        throw new err_mess('职位名输入过长')
      }

      if (req_data.company && req_data.company.length > 20) {
        throw new err_mess('公司名字输入过长')
      }

      if (req_data.home_page && !checkUrl(req_data.home_page)) {
        throw new err_mess('请输入正确的个人网址')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    let update_user = await models.user.update(
      {
        sex: req_data.sex || '',
        nickname: req_data.nickname || '',
        introduction: req_data.introduction || ''
      },
      {
        where: {
          uid: ctx.session.uid //查询条件
        }
      }
    )

    let update_user_info = await models.user_info.update(
      {
        profession: req_data.profession || '',
        company: req_data.company || '',
        home_page: req_data.home_page || ''
      },
      {
        where: {
          uid: ctx.session.uid //查询条件
        }
      }
    )

    home_resJson(ctx, {
      state: 'success',
      message: '修改用户信息成功',
      data: {
        user: update_user,
        user_info: update_user_info
      }
    })
  }

  /**
   * 修改用户密码
   * @param   {obejct} ctx 上下文对象
   */

  static async post_update_user_password(ctx) {
    let req_data = ctx.request.body

    let user = await models.user.findOne({
      where: {
        uid: ctx.session.uid
      }
    })

    if (
      tools.encrypt(req_data.old_password, config.encrypt_key) === user.password
    ) {
      try {
        if (!req_data.old_password) {
          throw new err_mess('请输入旧密码')
        }

        if (!req_data.new_password) {
          throw new err_mess('请输入新密码')
        }

        if (!checkPwd(req_data.new_password)) {
          throw new err_mess('密码格式输入有误!')
        }

        if (!req_data.repeat_new_password) {
          throw new err_mess('请重复输入新密码')
        }

        if (req_data.repeat_new_password !== req_data.new_password) {
          throw new err_mess('两次输入密码不相同')
        }
      } catch (err) {
        home_resJson(ctx, {
          state: 'error',
          message: err.message
        })
        return false
      }

      await models.user
        .update(
          {
            password: tools.encrypt(req_data.new_password, config.encrypt_key)
          },
          {
            where: {
              uid: ctx.session.uid //查询条件
            }
          }
        )
        .then(() => {
          home_resJson(ctx, {
            state: 'success',
            message: '修改用户密码成功'
          })
        })
        .catch(() => {
          home_resJson(ctx, {
            state: 'error',
            message: '修改密码失败。请再次尝试'
          })
        })
    } else {
      home_resJson(ctx, {
        state: 'error',
        message: '旧密码错误，请重新输入'
      })
    }
  }

  /**
   * 获取未读用户消息数量
   * @param   {obejct} ctx 上下文对象
   */
  static async get_unread_message_count(ctx) {
    let unread_message_count = await models.user_message.count({
      where: {
        uid: ctx.session.uid,
        is_read: false
      }
    })

    home_resJson(ctx, {
      state: 'success',
      message: '数据返回成功',
      data: {
        unread_message_count: unread_message_count
      }
    })
  }

  /**
   * 获取用户消息
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_message(ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    let unread_user_message_id = await models.user_message
      .findAll({
        // 获取所有未读消息id
        where: {
          is_system: false,
          is_read: false
        }
      })
      .then(res => {
        return res.map((item, key) => {
          return item.id
        })
      })

    let { count, rows } = await models.user_message
      .findAndCountAll({
        where: {
          uid: ctx.session.uid,
          is_system: false
        }, //为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, //每页限制返回的数据条数
        order: [['create_date_timestamp', 'desc']]
      })
      .then(res => {
        return JSON.parse(JSON.stringify(res))
      })

    for (let item in rows) {
      // 循环取用户
      await (async i => {
        rows[i].other_user = {}
        let data = await models.user
          .findOne({
            where: { uid: rows[i].other_uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
          .then(res => {
            return JSON.parse(JSON.stringify(res))
          })
        if (data) {
          rows[i].other_user = data
        }
      })(item)
    }

    if (unread_user_message_id.length > 0) {
      // 修改未读为已读
      await models.user_message.update(
        {
          is_read: true
        },
        {
          where: {
            id: { in: unread_user_message_id },
            uid: ctx.session.uid
          }
        }
      )
    }

    await home_resJson(ctx, {
      state: 'success',
      message: '数据返回成功',
      data: {
        count,
        user_message_list: rows,
        page,
        pageSize
      }
    })
  }

  /**
   * 删除用户消息
   * @param   {obejct} ctx 上下文对象
   */
  static async post_delete_user_message(ctx) {
    let formData = ctx.request.body

    await models.user_message
      .destroy({
        where: {
          id: formData.user_message_id,
          uid: ctx.session.uid
        }
      })
      .then(data => {
        home_resJson(ctx, {
          state: 'success',
          message: '删除用户消息成功'
        })
      })
      .catch(err => {
        home_resJson(ctx, {
          state: 'error',
          message: '删除用户消息失败'
        })
      })
  }

  /**
   * 渲染user settings profile
   * @param   {obejct} ctx 上下文对象
   */

  static async render_user_settings_profile(ctx) {
    // get 页面

    await render(ctx, {
      title: '个人资料页',
      view_url: 'default/user_settings/user_settings_profile',
      state: 'success',
      message: 'user_settings_profile',
      data: {
        router_name: 'profile'
      }
    })
  }

  /**
   * 渲染user settings profile
   * @param   {obejct} ctx 上下文对象
   */

  static async render_user_settings_password(ctx) {
    // get 页面

    await render(ctx, {
      title: '密码修改',
      view_url: 'default/user_settings/user_settings_password',
      state: 'success',
      message: 'user_settings_profile',
      data: {
        router_name: 'password'
      }
    })
  }

  /**
   * 渲染user reset password
   * @param   {obejct} ctx 上下文对象
   */
  static async render_reset_password(ctx) {
    // get 页面

    await render(ctx, {
      title: '重置密码',
      view_url: 'default/reset_password',
      state: 'success',
      message: 'reset_password'
    })
  }

  /**
   * 重置密码code发送
   * @param   {obejct} ctx 上下文对象
   */

  static async post_reset_password_code(ctx) {
    let req_data = ctx.request.body
    if (req_data.type === 'email') {
      /*邮箱注册验证码*/

      try {
        if (!req_data.email) {
          throw new err_mess('邮箱不存在')
        }
        if (!checkEmail(req_data.email)) {
          throw new err_mess('邮箱格式输入有误')
        }
      } catch (err) {
        home_resJson(ctx, {
          state: 'error',
          message: err.message
        })
        return false
      }

      try {
        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })
        if (email) {
          let random = random_number(true, 6, 6)

          await models.verify_code
            .create({
              phone: '',
              email: req_data.email,
              type: 'reset_password',
              verify_code: random,
              expire_time: moment()
                .utc()
                .utcOffset(+8)
                .format('X'),
              create_date: moment()
                .utc()
                .utcOffset(+8)
                .format() /*时间*/
            })
            .then(function(data) {
              send_verify_code_mail(req_data.email, '重置密码验证码', random)
              home_resJson(ctx, {
                state: 'success',
                message: '验证码已发送到邮箱'
              })
            })
            .catch(function(err) {
              home_resJson(ctx, {
                state: 'error',
                message: err
              })
            })
        } else {
          home_resJson(ctx, {
            state: 'error',
            message: '邮箱不存在'
          })
        }
      } catch (err) {
        home_resJson(ctx, {
          state: 'error',
          message: err
        })
      }
    } else if (req_data.type === 'phone') {
      /* 手机号码*/
      home_resJson(ctx, {
        state: 'error',
        message: '暂时未开放手机号码修改密码'
      })
    } else {
      /* 非手机号码非邮箱*/
      home_resJson(ctx, {
        state: 'error',
        message: '请输入正确的手机号码或者邮箱'
      })
    }
  }

  /**
   * 重置密码code发送
   * @param   {obejct} ctx 上下文对象
   */

  static async post_reset_password(ctx) {
    let req_data = ctx.request.body
    try {
      if (!req_data.email) {
        throw new err_mess('邮箱不存在')
      }
      if (!checkEmail(req_data.email)) {
        throw new err_mess('邮箱格式输入有误')
      }
      if (!req_data.code) {
        throw new err_mess('验证码不存在')
      }
      if (!req_data.new_password) {
        throw new err_mess('密码不存在')
      }
      if (!checkPwd(req_data.new_password)) {
        throw new err_mess('密码格式输入有误!')
      }
      if (req_data.new_password !== req_data.repeat_new_password) {
        throw new err_mess('两次输入密码不一致')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    if (req_data.type === 'email') {
      /*邮箱注册*/

      try {
        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })

        try {
          if (email) {
            await query_user_verify_code(req_data.email).then(data => {
              /*重置密码验证码验证*/
              if (data.length > 0) {
                let time_num = moment()
                  .utc()
                  .utcOffset(+8)
                  .format('X')
                if (req_data.code === data[0].verify_code) {
                  if (
                    Number(time_num) - Number(data[0].expire_time) >
                    30 * 60
                  ) {
                    throw new err_mess('验证码已过时，请再次发送')
                  }
                } else {
                  throw new err_mess('验证码错误')
                }
              } else {
                throw new err_mess('请发送验证码')
              }
            })

            await models.user
              .update(
                {
                  password: tools.encrypt(
                    req_data.new_password,
                    config.encrypt_key
                  )
                },
                {
                  where: {
                    email: req_data.email //查询条件
                  }
                }
              )
              .then(() => {
                home_resJson(ctx, {
                  state: 'success',
                  message: '修改用户密码成功'
                })
              })
              .catch(() => {
                home_resJson(ctx, {
                  state: 'error',
                  message: '修改密码失败。请再次尝试'
                })
              })
          } else {
            home_resJson(ctx, {
              state: 'error',
              message: '邮箱不存在'
            })
          }
        } catch (err) {
          home_resJson(ctx, {
            state: 'error',
            message: err.message
          })
        }
      } catch (err) {
        home_resJson(ctx, {
          state: 'error',
          message: err
        })
      }
    } else if (req_data.type === 'phone') {
      // 手机号码重置密码

      home_resJson(ctx, {
        state: 'error',
        message: '暂时未开放手机号码重置密码'
      })
    } else {
      /* 非手机号码非邮箱*/
      home_resJson(ctx, {
        state: 'error',
        message: '请输入正确的手机号码或者邮箱'
      })
    }
  }

  /**
   *  获取所有用户角色标签
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_tag_all(ctx) {
    // get 页面

    let user_tag_all = await models.user_tag.findAll()
    home_resJson(ctx, {
      state: 'success',
      message: '获取成功',
      data: {
        user_tag_all
      }
    })
  }
}

module.exports = User