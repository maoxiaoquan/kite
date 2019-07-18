const models = require('../../../db/mysqldb/index')
const {
  checkEmail,
  checkPhoneNum,
  checkUrl,
  checkPwd
} = require('../../utils/validators')
const moment = require('moment')
const { client_resJson } = require('../../utils/res_data')
const { send_verify_code_mail } = require('../../utils/send_email')
const { random_number, tools } = require('../../utils/index')
const config = require('../../config')
const Op = require('sequelize').Op
const tokens = require('../../utils/tokens')
const { query_user_verify_code } = require('../../sql/query')
const { lowdb } = require('../../../db/lowdb/index')
const clientWhere = require('../../utils/client_where')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class User {
  static async post_sign_in (ctx) {
    const { no_login } = lowdb
      .read()
      .get('config')
      .value()

    let reqDate = ctx.request.body

    try {
      if (!reqDate.email) {
        throw new ErrorMessage('请输入账户')
      }
      if (!reqDate.password) {
        throw new ErrorMessage('请输入密码')
      }
      if (no_login === 'no') {
        throw new ErrorMessage('登录功能关闭，请联系管理员开启')
      }

      if (reqDate.email) {
        /* 邮箱登录 */

        let sqlUser = await models.user.findOne({
          where: {
            email: reqDate.email
          }
        })

        if (!sqlUser) {
          throw new ErrorMessage('账户不存在')
        }

        if (!sqlUser.enable) {
          throw new ErrorMessage('当前用户已被限制登录，请联系管理员修改')
        }

        if (sqlUser) {
          if (
            tools.encrypt(reqDate.password, config.encrypt_key) ===
            sqlUser.dataValues.password
          ) {
            let user_info = {
              uid: sqlUser.uid
            }

            let token = tokens.ClientSetToken(60 * 60 * 24 * 7, user_info)

            await client_resJson(ctx, {
              state: 'success',
              message: '登录成功',
              data: {
                token
              }
            })
          } else {
            client_resJson(ctx, {
              state: 'error',
              message: '密码错误'
            })
          }
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '账户不存在'
          })
        }
      } else if (reqDate.phone) {
        /* 手机号码登录 */

        client_resJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码登录'
        })
      } else {
        /* 非手机号码非邮箱 */
        client_resJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 注册验证码发送
  static async post_sign_up_code (ctx) {
    let req_data = ctx.request.body
    try {
      const { on_register } = lowdb
        .read()
        .get('config')
        .value()
      if (req_data.email) {
        /* 邮箱注册验证码 */

        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })
        if (on_register === 'no') {
          throw new ErrorMessage('注册功能关闭，请联系管理员开启')
        }
        if (req_data.email) {
          if (!checkEmail(req_data.email)) {
            throw new ErrorMessage('请输入正确的邮箱地址')
          }
        }
        if (req_data.phone) {
          if (!checkPhoneNum(req_data.phone)) {
            throw new ErrorMessage('请输入正确的手机号码')
          }
        }

        if (!email) {
          let random = random_number(true, 6, 6)
          await models.verify_code.create({
            email: req_data.email,
            verify_code: random,
            type: 'register'
          })
          await send_verify_code_mail(req_data.email, '注册验证码', random)
          client_resJson(ctx, {
            state: 'success',
            message: '验证码已发送到邮箱'
          })
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '邮箱已存在'
          })
        }
      } else if (req_data.phone) {
        /* 手机号码注册 */
        client_resJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码注册'
        })
      } else {
        /* 非手机号码非邮箱 */
        client_resJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户注册post
   * @param   {object} ctx 上下文对象
   */
  static async post_sign_up (ctx) {
    // post 数据
    let req_data = ctx.request.body
    let date = new Date()
    try {
      const { on_register } = lowdb
        .read()
        .get('config')
        .value()
      if (on_register === 'no') {
        throw new ErrorMessage('注册功能关闭，请联系管理员开启')
      }
      if (!req_data.nickname) {
        throw new ErrorMessage('昵称不存在')
      }
      if (req_data.nickname.length > 20) {
        throw new ErrorMessage('昵称过长')
      }
      if (req_data.email) {
        if (!checkEmail(req_data.email)) {
          throw new ErrorMessage('请输入正确的邮箱地址')
        }
      }
      if (req_data.phone) {
        if (!checkPhoneNum(req_data.phone)) {
          throw new ErrorMessage('请输入正确的手机号码')
        }
      }
      if (!req_data.password) {
        throw new ErrorMessage('密码不存在')
      }
      if (!checkPwd(req_data.password)) {
        throw new ErrorMessage(
          '密码格式输入有误，请输入字母与数字的组合,长度为最小为6个字符!'
        )
      }
      if (req_data.password !== req_data.double_password) {
        throw new ErrorMessage('两次输入密码不一致')
      }
      if (!req_data.code) {
        throw new ErrorMessage('验证码不存在')
      }

      if (req_data.email) {
        /* 邮箱注册 */

        let nickname_date = await models.user.findOne({
          where: {
            nickname: req_data.nickname
          }
        })

        if (nickname_date) {
          client_resJson(ctx, {
            state: 'error',
            message: '用户昵称已存在，请重新输入'
          })
          return false
        }

        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })

        if (!email) {
          await query_user_verify_code(req_data.email).then(data => {
            /* 注册验证码验证 */
            if (data.length > 0) {
              let time_num = moment(date.setHours(date.getHours())).format('X')
              if (req_data.code === data[0].verify_code) {
                if (
                  Number(time_num) - Number(data[0].create_timestamp) >
                  30 * 60
                ) {
                  throw new ErrorMessage('验证码已过时，请再次发送')
                }
              } else {
                throw new ErrorMessage('验证码错误')
              }
            } else {
              throw new ErrorMessage('请发送验证码')
            }
          })

          await models.sequelize.transaction(transaction => {
            // 在事务中执行操作
            return models.user
              .create({
                /* 注册写入数据库操作 */
                avatar: config.default_avatar,
                nickname: req_data.nickname,
                password: tools.encrypt(req_data.password, config.encrypt_key),
                email: req_data.email,
                user_role_ids: config.USER_ROLE.default_id,
                sex: 0,
                reg_ip: ctx.request.ip,
                enable: true
              })
              .then(user => {
                return models.user_info.create({
                  /* 注册写入数据库操作 */
                  uid: user.uid,
                  avatar_review_status: 2
                })
              })
          })
          client_resJson(ctx, {
            state: 'success',
            message: '注册成功，跳往登录页'
          })
        } else {
          throw new ErrorMessage('邮箱已存在')
        }
      } else if (req_data.phone) {
        /* 手机号码注册 */
        throw new ErrorMessage('暂时未开放手机号码注册')
      } else {
        /* 非手机号码非邮箱 */
        throw new ErrorMessage('请输入正确的手机号码或者邮箱')
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取个人信息get 并且知道用户是否登录，不需要任何参数
   */
  static async personal_info (ctx) {
    let { islogin = '', user = '' } = ctx.request
    try {
      let find_user = await models.user.findOne({
        where: { uid: user.uid },
        attributes: [
          'uid',
          'avatar',
          'nickname',
          'sex',
          'introduction',
          'user_role_ids'
        ]
      })
      await client_resJson(ctx, {
        state: 'success',
        message: '获取成功',
        data: {
          islogin,
          user: find_user
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取用户信息get
   * @param   {object} ctx 上下文对象
   */
  static async get_user_info (ctx) {
    let uid = ctx.query.uid

    try {
      if (!uid) {
        throw new ErrorMessage('uid为空')
      }

      let findOne_user = await models.user.findOne({
        // 获取用户信息
        where: { uid },
        attributes: [
          'uid',
          'avatar',
          'nickname',
          'sex',
          'introduction',
          'user_role_ids'
        ]
      })

      let findOne_user_info = await models.user_info.findOne({
        // 获取用户信息
        where: { uid }
      })

      let user_attention_uid_arr = await models.user_attention
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((attention_item, key) => {
            return attention_item.attention_uid
          })
        })

      let user_attention_other_count = await models.user_attention.count({
        // 关注了多少人
        where: {
          uid
        }
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
          uid,
          ...clientWhere.article.me
        }
      })

      client_resJson(ctx, {
        state: 'success',
        message: '获取用户所有信息成功',
        data: {
          user: findOne_user,
          user_info: findOne_user_info,
          attention_uid_arr: user_attention_uid_arr,
          user_like_aid_arr: user_like_article_arr,
          subscribe_article_tag_id_arr: subscribe_article_tag_arr,
          other_user_attention_count,
          user_attention_other_count,
          user_article_count
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 修改用户信息post
   * @param   {object} ctx 上下文对象
   */

  static async post_update_user_info (ctx) {
    let req_data = ctx.request.body
    let { user = '' } = ctx.request
    let nickname_date = await models.user.findOne({
      where: {
        nickname: req_data.nickname,
        uid: {
          [Op.ne]: user.uid
        }
      }
    })

    try {
      if (req_data.nickname && req_data.nickname.length > 20) {
        throw new ErrorMessage('昵称过长')
      }

      if (nickname_date) {
        throw new ErrorMessage('用户昵称已存在，请重新输入')
      }

      if (req_data.introduction && req_data.introduction.length > 50) {
        throw new ErrorMessage('个人介绍过长')
      }

      if (req_data.profession && req_data.profession.length > 20) {
        throw new ErrorMessage('职位名输入过长')
      }

      if (req_data.company && req_data.company.length > 20) {
        throw new ErrorMessage('公司名字输入过长')
      }

      if (req_data.home_page && !checkUrl(req_data.home_page)) {
        throw new ErrorMessage('请输入正确的个人网址')
      }

      let update_user = await models.user.update(
        {
          sex: req_data.sex || '',
          nickname: req_data.nickname || '',
          introduction: req_data.introduction || ''
        },
        {
          where: {
            uid: user.uid // 查询条件
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
            uid: user.uid // 查询条件
          }
        }
      )

      client_resJson(ctx, {
        state: 'success',
        message: '修改用户信息成功',
        data: {
          user: update_user,
          user_info: update_user_info
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 修改用户密码
   * @param   {object} ctx 上下文对象
   */

  static async post_update_user_password (ctx) {
    let req_data = ctx.request.body
    let { user = '' } = ctx.request
    try {
      let findUser = await models.user.findOne({
        where: {
          uid: user.uid
        }
      })

      if (
        tools.encrypt(req_data.old_password, config.encrypt_key) ===
        findUser.password
      ) {
        if (!req_data.old_password) {
          throw new ErrorMessage('请输入旧密码')
        }

        if (!req_data.new_password) {
          throw new ErrorMessage('请输入新密码')
        }

        if (!checkPwd(req_data.new_password)) {
          throw new ErrorMessage('密码格式输入有误!')
        }

        if (!req_data.repeat_new_password) {
          throw new ErrorMessage('请重复输入新密码')
        }

        if (req_data.repeat_new_password !== req_data.new_password) {
          throw new ErrorMessage('两次输入密码不相同')
        }

        await models.user.update(
          {
            password: tools.encrypt(req_data.new_password, config.encrypt_key)
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
        client_resJson(ctx, {
          state: 'success',
          message: '修改用户密码成功'
        })
      } else {
        client_resJson(ctx, {
          state: 'error',
          message: '旧密码错误，请重新输入'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取未读用户消息数量
   * @param   {object} ctx 上下文对象
   */
  static async get_unread_message_count (ctx) {
    let { user = '' } = ctx.request
    try {
      let count = await models.user_message.count({
        where: {
          uid: user.uid,
          is_read: false
        }
      })

      client_resJson(ctx, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count: count
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取用户消息
   * @param   {object} ctx 上下文对象
   */
  static async get_user_message (ctx) {
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let { user = '' } = ctx.request
    try {
      let unread_user_message_id = await models.user_message
        .findAll({
          // 获取所有未读消息id
          where: {
            is_read: false,
            uid: user.uid
          }
        })
        .then(res => {
          return res.map((item, key) => {
            return item.id
          })
        })

      let { count, rows } = await models.user_message.findAndCountAll({
        where: {
          uid: user.uid
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_at',
          await moment(rows[i].create_date).format('YYYY-MM-DD')
        )
        rows[i].setDataValue(
          'other_user',
          await models.user.findOne({
            where: { uid: JSON.parse(rows[i].content).other_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        if (rows[i].type === 2) {
          rows[i].setDataValue(
            'article',
            await models.article.findOne({
              where: { aid: JSON.parse(rows[i].content).aid },
              attributes: ['aid', 'uid', 'title']
            })
          )
        } else if (rows[i].type === 4) {
        } else if (rows[i].type === 5) {
          // 评论
          rows[i].setDataValue(
            'comment',
            await models.comment.findOne({
              where: { id: JSON.parse(rows[i].content).comment_id }
            })
          )
          rows[i].setDataValue(
            'article',
            await models.article.findOne({
              where: { aid: JSON.parse(rows[i].content).aid },
              attributes: ['aid', 'uid', 'title']
            })
          )
        }
        rows[i].setDataValue('title', JSON.parse(rows[i].content).title)
      }

      if (unread_user_message_id.length > 0) {
        // 修改未读为已读
        await models.user_message.update(
          {
            is_read: true
          },
          {
            where: {
              id: { [Op.in]: unread_user_message_id },
              uid: user.uid
            }
          }
        )
      }

      await client_resJson(ctx, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count,
          user_message_list: rows,
          page,
          pageSize
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除用户消息
   * @param   {object} ctx 上下文对象
   */
  static async post_delete_user_message (ctx) {
    let formData = ctx.query
    let { user = '' } = ctx.request
    try {
      let findOneUserMessage = await models.user_message.findOne({
        where: {
          id: formData.user_message_id,
          uid: user.uid
        }
      })
      if (findOneUserMessage) {
        await models.user_message.destroy({
          where: {
            id: formData.user_message_id,
            uid: user.uid
          }
        })
      } else {
        throw new ErrorMessage('非法操作')
      }
      client_resJson(ctx, {
        state: 'success',
        message: '删除用户消息成功'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 重置密码code发送
   * @param   {object} ctx 上下文对象
   */

  static async post_reset_password_code (ctx) {
    let req_data = ctx.request.body
    try {
      if (req_data.type === 'email') {
        /* 邮箱注册验证码 */

        if (!req_data.email) {
          throw new ErrorMessage('邮箱不存在')
        }
        if (!checkEmail(req_data.email)) {
          throw new ErrorMessage('邮箱格式输入有误')
        }

        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })
        if (email) {
          let random = random_number(true, 6, 6)

          await models.verify_code.create({
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
              .format() /* 时间 */
          })
          send_verify_code_mail(req_data.email, '重置密码验证码', random)
          client_resJson(ctx, {
            state: 'success',
            message: '验证码已发送到邮箱'
          })
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '邮箱不存在'
          })
        }
      } else if (req_data.type === 'phone') {
        /* 手机号码 */
        client_resJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码修改密码'
        })
      } else {
        /* 非手机号码非邮箱 */
        client_resJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 重置密码code发送
   * @param   {object} ctx 上下文对象
   */

  static async post_reset_password (ctx) {
    let req_data = ctx.request.body
    try {
      if (!req_data.email) {
        throw new ErrorMessage('邮箱不存在')
      }
      if (!checkEmail(req_data.email)) {
        throw new ErrorMessage('邮箱格式输入有误')
      }
      if (!req_data.code) {
        throw new ErrorMessage('验证码不存在')
      }
      if (!req_data.new_password) {
        throw new ErrorMessage('密码不存在')
      }
      if (!checkPwd(req_data.new_password)) {
        throw new ErrorMessage('密码格式输入有误!')
      }
      if (req_data.new_password !== req_data.repeat_new_password) {
        throw new ErrorMessage('两次输入密码不一致')
      }

      if (req_data.type === 'email') {
        /* 邮箱注册 */

        let email = await models.user.findOne({
          where: {
            email: req_data.email
          }
        })

        if (email) {
          await query_user_verify_code(req_data.email).then(data => {
            /* 重置密码验证码验证 */
            if (data.length > 0) {
              let time_num = moment()
                .utc()
                .utcOffset(+8)
                .format('X')
              if (req_data.code === data[0].verify_code) {
                if (Number(time_num) - Number(data[0].expire_time) > 30 * 60) {
                  throw new ErrorMessage('验证码已过时，请再次发送')
                }
              } else {
                throw new ErrorMessage('验证码错误')
              }
            } else {
              throw new ErrorMessage('请发送验证码')
            }
          })

          await models.user.update(
            {
              password: tools.encrypt(req_data.new_password, config.encrypt_key)
            },
            {
              where: {
                email: req_data.email // 查询条件
              }
            }
          )
          client_resJson(ctx, {
            state: 'success',
            message: '修改用户密码成功'
          })
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '邮箱不存在'
          })
        }
      } else if (req_data.type === 'phone') {
        // 手机号码重置密码

        client_resJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码重置密码'
        })
      } else {
        /* 非手机号码非邮箱 */
        client_resJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   *  获取所有用户角色标签
   * @param   {object} ctx 上下文对象
   */
  static async get_user_role_all (ctx) {
    // get 页面
    try {
      let user_role_all = await models.user_role.findAll({
        where: {
          enable: true,
          is_show: true
        }
      })
      client_resJson(ctx, {
        state: 'success',
        message: '获取成功',
        data: {
          user_role_all
        }
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = User
