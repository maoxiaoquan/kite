const { sign_resJson, admin_resJson } = require('../../utils/res_data')
const tokens = require('../../utils/tokens')
const {
  checkUserName,
  checkPwd,
  checkEmail
} = require('../../utils/validators')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../config')
const models = require('../../../db/mysqldb/index')
const { admin_user } = require('../../../db/mysqldb/index')
const moment = require('moment')
const { create_admin_system_log } = require('./admin_system_log')
const Op = require('sequelize').Op
const { lowdb } = require('../../../db/lowdb/index')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Admin_users {
  /**
   * 登录操作
   * @param  {object} ctx 上下文对象
   */
  static async admin_sign_in (ctx) {
    let { account, password, uid } = ctx.request.body
    let admin_user_info = {}
    try {
      if (!account) {
        throw new ErrorMessage('请输入账户!')
      }
      if (!checkUserName(account)) {
        throw new ErrorMessage('5-22个英文字符!')
      }
      if (!password) {
        throw new ErrorMessage('请输入密码!')
      }
      admin_user_info = await admin_user.findOne({ where: { account } })
      if (!admin_user_info) {
        throw new ErrorMessage('用户不存在!')
      }
      if (
        !(encrypt(password, config.encrypt_key) === admin_user_info.password)
      ) {
        throw new ErrorMessage('密码错误!')
      }
      if (!admin_user_info.enable) {
        throw new ErrorMessage('您已被限制登录!')
      }

      let datas = {
        uid: admin_user_info.uid,
        account,
        role_id: admin_user_info ? admin_user_info.admin_role_ids : ''
      }
      let token = tokens.AdminSetToken(60 * 60 * 24 * 7, datas)
      sign_resJson(ctx, {
        state: 'success',
        message: '登录成功',
        token
      })
    } catch (err) {
      sign_resJson(
        ctx,
        {
          state: 'error',
          message: '错误信息：' + err.message
        },
        false
      )
      return false
    }
  }

  /**
   * 注册操作
   * @param   {object} ctx 上下文对象
   */
  static async create_admin_user (ctx) {
    const req_data = ctx.request.body

    try {
      if (!req_data.account) {
        throw new ErrorMessage('请输入账户!')
      }
      if (!req_data.nickname) {
        throw new ErrorMessage('请输入昵称!')
      }
      if (!checkUserName(req_data.account)) {
        throw new ErrorMessage('账户须5-22个英文字符!')
      }
      if (!req_data.password) {
        throw new ErrorMessage('请输入密码!')
      }
      if (!checkPwd(req_data.password)) {
        throw new ErrorMessage('密码格式输入有误!')
      }
      if (!checkEmail(req_data.email)) {
        throw new ErrorMessage('邮箱格式输入有误!')
      }
      let admin_user_findOne = await admin_user.findOne({
        where: { account: req_data.account }
      })

      if (admin_user_findOne) {
        throw new ErrorMessage('账户已存在!')
      }

      await admin_user.create({
        account: req_data.account,
        avatar: config.default_avatar,
        nickname: req_data.nickname,
        password: encrypt(req_data.password, config.encrypt_key),
        email: req_data.email,
        phone: req_data.phone,
        reg_time: moment()
          .utc()
          .utcOffset(+8)
          .format('X'),
        reg_ip: ctx.request.ip,
        enable: req_data.enable || false
      })
      await admin_resJson(ctx, {
        state: 'success',
        message: '注册成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新管理员用户
   * @param   {object} ctx 上下文对象
   */
  static async edit_admin_user (ctx) {
    const res_data = ctx.request.body
    try {
      await admin_user.update(
        {
          account: res_data.account,
          nickname: res_data.nickname,
          password: encrypt(res_data.password, config.encrypt_key),
          email: res_data.email,
          phone: res_data.phone,
          enable: res_data.enable || false
        },
        {
          where: {
            uid: res_data.uid // 查询条件
          }
        }
      )
      admin_resJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async get_admin_user_list (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await admin_user.findAndCountAll({
        attributes: [
          'uid',
          'account',
          'nickname',
          'email',
          'phone',
          'last_sign_time',
          'reg_ip',
          'enable',
          'admin_role_ids'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          admin_user_list: rows
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取后台用户信息
   * @param   {object} ctx 上下文对象
   */
  static async get_admin_user_info (ctx) {
    const { userInfo = {} } = ctx.request
    try {
      const { role_id } = userInfo

      const website = lowdb
        .read()
        .get('website')
        .value()

      let userAllRole = await models.admin_role.findOne({
        where: {
          role_id
        }
      })
      let whereParmams = { authority_type: '1' }
      role_id !== config.SUPER_ROLE_ID &&
        (whereParmams['authority_id'] = {
          [Op.in]: userAllRole.admin_authority_ids.split(',')
        })
      let AllAuthorityName = await models.admin_authority.findAll({
        where: whereParmams
      })

      let AuthorityNameId = []
      for (let i in AllAuthorityName) {
        AuthorityNameId.push(AllAuthorityName[i].authority_url)
      }

      let fint_user_info = await admin_user.findOne({
        attributes: [
          'uid',
          'avatar',
          'account',
          'nickname',
          'email',
          'phone',
          'last_sign_time',
          'reg_ip',
          'enable'
        ]
      })

      admin_resJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          admin_user_info: fint_user_info,
          AuthorityNameId,
          website
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

  /**
   * 删除用户
   * @param   {object} ctx 上下文对象
   * 删除用户先判断管理员角色表中是否有关联，
   * 无关联则直接管理员删除，有关联则开启事务同时删除管理员角色关联表中关联
   * 管理员对角色是一对一的关系
   */
  static async delete_admin_user (ctx) {
    const { uid } = ctx.request.body
    /* 无关联 */
    try {
      await admin_user.destroy({ where: { uid } })
      await create_admin_system_log({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 3,
        content: `成功删了了id为‘${uid}’的管理员`
      })

      admin_resJson(ctx, {
        state: 'success',
        message: '删除管理员用户成功'
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }
}

module.exports = Admin_users
