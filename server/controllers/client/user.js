const models = require('../../../db/mysqldb/index')
const {
  checkEmail,
  checkPhoneNum,
  checkUrl,
  checkPwd
} = require('../../utils/validators')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const { sendVerifyCodeMail } = require('../../utils/sendEmail')
const { random_number, tools } = require('../../utils/index')
const config = require('../../config')
const Op = require('sequelize').Op
const tokens = require('../../utils/tokens')
const { queryUserVerifyCode } = require('../../sql/query')
const { lowdb } = require('../../../db/lowdb/index')
const clientWhere = require('../../utils/clientWhere')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class User {
  static async userSignIn (ctx) {
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

        let oneUser = await models.user.findOne({
          where: {
            email: reqDate.email
          }
        })

        if (!oneUser) {
          throw new ErrorMessage('账户不存在')
        }

        if (!oneUser.enable) {
          throw new ErrorMessage('当前用户已被限制登录，请联系管理员修改')
        }

        if (oneUser) {
          if (
            tools.encrypt(reqDate.password, config.ENCRYPT_KEY) ===
            oneUser.dataValues.password
          ) {
            let user_info = {
              uid: oneUser.uid
            }

            let token = tokens.ClientSetToken(60 * 60 * 24 * 7, user_info)

            await resClientJson(ctx, {
              state: 'success',
              message: '登录成功',
              data: {
                token
              }
            })
          } else {
            resClientJson(ctx, {
              state: 'error',
              message: '密码错误'
            })
          }
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '账户不存在'
          })
        }
      } else if (reqDate.phone) {
        /* 手机号码登录 */

        resClientJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码登录'
        })
      } else {
        /* 非手机号码非邮箱 */
        resClientJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 注册验证码发送
  static async userSignUpCode (ctx) {
    let reqData = ctx.request.body
    try {
      const { on_register } = lowdb
        .read()
        .get('config')
        .value()
      if (reqData.email) {
        /* 邮箱注册验证码 */

        let oneUser = await models.user.findOne({
          where: {
            email: reqData.email
          }
        })
        if (on_register === 'no') {
          throw new ErrorMessage('注册功能关闭，请联系管理员开启')
        }
        if (reqData.email) {
          if (!checkEmail(reqData.email)) {
            throw new ErrorMessage('请输入正确的邮箱地址')
          }
        }
        if (reqData.phone) {
          if (!checkPhoneNum(reqData.phone)) {
            throw new ErrorMessage('请输入正确的手机号码')
          }
        }

        if (!oneUser) {
          let random = random_number(true, 6, 6)
          await models.verify_code.create({
            email: reqData.email,
            verify_code: random,
            type: 'register'
          })
          await sendVerifyCodeMail(reqData.email, '注册验证码', random)
          resClientJson(ctx, {
            state: 'success',
            message: '验证码已发送到邮箱'
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '邮箱已存在'
          })
        }
      } else if (reqData.phone) {
        /* 手机号码注册 */
        resClientJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码注册'
        })
      } else {
        /* 非手机号码非邮箱 */
        resClientJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
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
  static async userSignUp (ctx) {
    // post 数据
    let reqData = ctx.request.body
    let date = new Date()
    try {
      const { on_register } = lowdb
        .read()
        .get('config')
        .value()
      if (on_register === 'no') {
        throw new ErrorMessage('注册功能关闭，请联系管理员开启')
      }
      if (!reqData.nickname) {
        throw new ErrorMessage('昵称不存在')
      }
      if (reqData.nickname.length > 20) {
        throw new ErrorMessage('昵称过长')
      }
      if (reqData.email) {
        if (!checkEmail(reqData.email)) {
          throw new ErrorMessage('请输入正确的邮箱地址')
        }
      }
      if (reqData.phone) {
        if (!checkPhoneNum(reqData.phone)) {
          throw new ErrorMessage('请输入正确的手机号码')
        }
      }
      if (!reqData.password) {
        throw new ErrorMessage('密码不存在')
      }
      if (!checkPwd(reqData.password)) {
        throw new ErrorMessage(
          '密码格式输入有误，请输入字母与数字的组合,长度为最小为6个字符!'
        )
      }
      if (reqData.password !== reqData.double_password) {
        throw new ErrorMessage('两次输入密码不一致')
      }
      if (!reqData.code) {
        throw new ErrorMessage('验证码不存在')
      }

      if (reqData.email) {
        /* 邮箱注册 */

        let oneUserNickname = await models.user.findOne({
          where: {
            nickname: reqData.nickname
          }
        })

        if (oneUserNickname) {
          resClientJson(ctx, {
            state: 'error',
            message: '用户昵称已存在，请重新输入'
          })
          return false
        }

        let oneUserEmail = await models.user.findOne({
          where: {
            email: reqData.email
          }
        })

        if (!oneUserEmail) {
          await queryUserVerifyCode(reqData.email).then(data => {
            /* 注册验证码验证 */
            if (data.length > 0) {
              let time_num = moment(date.setHours(date.getHours())).format('X')
              if (reqData.code === data[0].verify_code) {
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
                nickname: reqData.nickname,
                password: tools.encrypt(reqData.password, config.ENCRYPT_KEY),
                email: reqData.email,
                user_role_ids: config.USER_ROLE.dfId,
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
          resClientJson(ctx, {
            state: 'success',
            message: '注册成功，跳往登录页'
          })
        } else {
          throw new ErrorMessage('邮箱已存在')
        }
      } else if (reqData.phone) {
        /* 手机号码注册 */
        throw new ErrorMessage('暂时未开放手机号码注册')
      } else {
        /* 非手机号码非邮箱 */
        throw new ErrorMessage('请输入正确的手机号码或者邮箱')
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取个人信息get 并且知道用户是否登录，不需要任何参数
   */
  static async userPersonalInfo (ctx) {
    let { islogin = '', user = '' } = ctx.request
    try {
      let oneUser = await models.user.findOne({
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
      await resClientJson(ctx, {
        state: 'success',
        message: '获取成功',
        data: {
          islogin,
          user: oneUser
        }
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取用户信息get 不需要登录
   * @param   {object} ctx 上下文对象
   */
  static async getUserInfo (ctx) {
    let uid = ctx.query.uid

    try {
      if (!uid) {
        throw new ErrorMessage('uid为空')
      }

      let oneUser = await models.user.findOne({
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

      let oneUserInfo = await models.user_info.findOne({
        // 获取用户信息
        where: { uid }
      })

      let allUserAttention = await models.attention_user
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((attention_item, key) => {
            return attention_item.attention_uid
          })
        })

      let userAttentionCount = await models.attention_user.count({
        // 关注了多少人
        where: {
          uid
        }
      })

      let allUserLikeArticleAid = await models.like_article
        .findAll({ where: { uid, is_like: true } })
        .then(res => {
          return res.map((item, key) => {
            return item.aid
          })
        })

      let allLikeDymaicId = await models.dynamic_like
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((item, key) => {
            return item.dynamic_id
          })
        })

      let allSubscribeArticleTagId = await models.attention_tag
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((item, key) => {
            return item.tag_id
          })
        })

      let allRssDynamicTopicId = await models.attention_topic
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((item, key) => {
            return item.topic_id
          })
        })

      let otherUserAttentionCount = await models.attention_user.count({
        // 多少人关注了
        where: {
          attention_uid: uid
        }
      })

      let articleCount = await models.article.count({
        // 他有多少文章
        where: {
          uid,
          ...clientWhere.article.me
        }
      })

      let dynamicCount = await models.dynamic.count({
        // 他有多少文章
        where: {
          uid,
          ...clientWhere.dynamic.myQuery
        }
      })

      resClientJson(ctx, {
        state: 'success',
        message: '获取用户所有信息成功',
        data: {
          user: oneUser,
          user_info: oneUserInfo,
          attention_uid_arr: allUserAttention,
          user_like_aid_arr: allUserLikeArticleAid,
          subscribe_article_tag_id_arr: allSubscribeArticleTagId,
          other_user_attention_count: otherUserAttentionCount,
          user_attention_other_count: userAttentionCount,
          user_article_count: articleCount,
          dynamicCount,
          allLikeDymaicId,
          allRssDynamicTopicId
        }
      })
    } catch (err) {
      resClientJson(ctx, {
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

  static async updateUserInfo (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    let oneUser = await models.user.findOne({
      where: {
        nickname: reqData.nickname,
        uid: {
          [Op.ne]: user.uid
        }
      }
    })

    try {
      if (reqData.nickname && reqData.nickname.length > 20) {
        throw new ErrorMessage('昵称过长')
      }

      if (oneUser) {
        throw new ErrorMessage('用户昵称已存在，请重新输入')
      }

      if (reqData.introduction && reqData.introduction.length > 50) {
        throw new ErrorMessage('个人介绍过长')
      }

      if (reqData.profession && reqData.profession.length > 20) {
        throw new ErrorMessage('职位名输入过长')
      }

      if (reqData.company && reqData.company.length > 20) {
        throw new ErrorMessage('公司名字输入过长')
      }

      if (reqData.home_page && !checkUrl(reqData.home_page)) {
        throw new ErrorMessage('请输入正确的个人网址')
      }

      let updateUser = await models.user.update(
        {
          sex: reqData.sex || '',
          nickname: reqData.nickname || '',
          introduction: reqData.introduction || ''
        },
        {
          where: {
            uid: user.uid // 查询条件
          }
        }
      )

      let updateUserInfo = await models.user_info.update(
        {
          profession: reqData.profession || '',
          company: reqData.company || '',
          home_page: reqData.home_page || ''
        },
        {
          where: {
            uid: user.uid // 查询条件
          }
        }
      )

      resClientJson(ctx, {
        state: 'success',
        message: '修改用户信息成功',
        data: {
          user: updateUser,
          user_info: updateUserInfo
        }
      })
    } catch (err) {
      resClientJson(ctx, {
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

  static async updateUserPassword (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      let oneUser = await models.user.findOne({
        where: {
          uid: user.uid
        }
      })

      if (
        tools.encrypt(reqData.old_password, config.ENCRYPT_KEY) ===
        oneUser.password
      ) {
        if (!reqData.old_password) {
          throw new ErrorMessage('请输入旧密码')
        }

        if (!reqData.new_password) {
          throw new ErrorMessage('请输入新密码')
        }

        if (!checkPwd(reqData.new_password)) {
          throw new ErrorMessage('密码格式输入有误!')
        }

        if (!reqData.repeat_new_password) {
          throw new ErrorMessage('请重复输入新密码')
        }

        if (reqData.repeat_new_password !== reqData.new_password) {
          throw new ErrorMessage('两次输入密码不相同')
        }

        await models.user.update(
          {
            password: tools.encrypt(reqData.new_password, config.ENCRYPT_KEY)
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
        resClientJson(ctx, {
          state: 'success',
          message: '修改用户密码成功'
        })
      } else {
        resClientJson(ctx, {
          state: 'error',
          message: '旧密码错误，请重新输入'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
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
  static async getUnreadMessageCount (ctx) {
    let { user = '' } = ctx.request
    try {
      let count = await models.user_message.count({
        where: {
          uid: user.uid,
          is_read: false
        }
      })

      resClientJson(ctx, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count: count
        }
      })
    } catch (err) {
      resClientJson(ctx, {
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
  static async getUserMessageList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let { user = '' } = ctx.request
    try {
      let allUserMessage = await models.user_message
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
          'create_dt',
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
          // 喜欢文章
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
            await models.article_comment.findOne({
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
        } else if (rows[i].type === 6) {
          // 动态评论
          rows[i].setDataValue(
            'comment',
            await models.dynamic_comment.findOne({
              where: { id: JSON.parse(rows[i].content).comment_id }
            })
          )
          rows[i].setDataValue(
            'dynamic',
            await models.dynamic.findOne({
              where: { id: JSON.parse(rows[i].content).dynamic_id }
            })
          )
        }
        rows[i].setDataValue('title', JSON.parse(rows[i].content).title)
      }

      if (allUserMessage.length > 0) {
        // 修改未读为已读
        await models.user_message.update(
          {
            is_read: true
          },
          {
            where: {
              id: { [Op.in]: allUserMessage },
              uid: user.uid
            }
          }
        )
      }

      await resClientJson(ctx, {
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
      resClientJson(ctx, {
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
  static async deleteUserMessage (ctx) {
    let reqData = ctx.query
    let { user = '' } = ctx.request
    try {
      let oneUserMessage = await models.user_message.findOne({
        where: {
          id: reqData.user_message_id,
          uid: user.uid
        }
      })
      if (oneUserMessage) {
        await models.user_message.destroy({
          where: {
            id: reqData.user_message_id,
            uid: user.uid
          }
        })
      } else {
        throw new ErrorMessage('非法操作')
      }
      resClientJson(ctx, {
        state: 'success',
        message: '删除用户消息成功'
      })
    } catch (err) {
      resClientJson(ctx, {
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

  static async sendResetPasswordCode (ctx) {
    let reqData = ctx.request.body
    try {
      if (reqData.type === 'email') {
        /* 邮箱注册验证码 */

        if (!reqData.email) {
          throw new ErrorMessage('邮箱不存在')
        }
        if (!checkEmail(reqData.email)) {
          throw new ErrorMessage('邮箱格式输入有误')
        }

        let email = await models.user.findOne({
          where: {
            email: reqData.email
          }
        })
        if (email) {
          let random = random_number(true, 6, 6)

          await models.verify_code.create({
            phone: '',
            email: reqData.email,
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
          sendVerifyCodeMail(reqData.email, '重置密码验证码', random)
          resClientJson(ctx, {
            state: 'success',
            message: '验证码已发送到邮箱'
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '邮箱不存在'
          })
        }
      } else if (reqData.type === 'phone') {
        /* 手机号码 */
        resClientJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码修改密码'
        })
      } else {
        /* 非手机号码非邮箱 */
        resClientJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 重置密码
   * @param   {object} ctx 上下文对象
   */

  static async userResetPassword (ctx) {
    let reqData = ctx.request.body
    try {
      if (!reqData.email) {
        throw new ErrorMessage('邮箱不存在')
      }
      if (!checkEmail(reqData.email)) {
        throw new ErrorMessage('邮箱格式输入有误')
      }
      if (!reqData.code) {
        throw new ErrorMessage('验证码不存在')
      }
      if (!reqData.new_password) {
        throw new ErrorMessage('密码不存在')
      }
      if (!checkPwd(reqData.new_password)) {
        throw new ErrorMessage('密码格式输入有误!')
      }
      if (reqData.new_password !== reqData.repeat_new_password) {
        throw new ErrorMessage('两次输入密码不一致')
      }

      if (reqData.type === 'email') {
        /* 邮箱注册 */

        let email = await models.user.findOne({
          where: {
            email: reqData.email
          }
        })

        if (email) {
          await queryUserVerifyCode(reqData.email).then(data => {
            /* 重置密码验证码验证 */
            if (data.length > 0) {
              let timeNum = moment()
                .utc()
                .utcOffset(+8)
                .format('X')
              if (reqData.code === data[0].verify_code) {
                if (Number(timeNum) - Number(data[0].expire_time) > 30 * 60) {
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
              password: tools.encrypt(reqData.new_password, config.ENCRYPT_KEY)
            },
            {
              where: {
                email: reqData.email // 查询条件
              }
            }
          )
          resClientJson(ctx, {
            state: 'success',
            message: '修改用户密码成功'
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '邮箱不存在'
          })
        }
      } else if (reqData.type === 'phone') {
        // 手机号码重置密码

        resClientJson(ctx, {
          state: 'error',
          message: '暂时未开放手机号码重置密码'
        })
      } else {
        /* 非手机号码非邮箱 */
        resClientJson(ctx, {
          state: 'error',
          message: '请输入正确的手机号码或者邮箱'
        })
      }
    } catch (err) {
      resClientJson(ctx, {
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
  static async getUserRoleAll (ctx) {
    // get 页面
    try {
      let allUserRole = await models.user_role.findAll({
        where: {
          enable: true,
          is_show: true
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '获取成功',
        data: {
          user_role_all: allUserRole
        }
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = User
