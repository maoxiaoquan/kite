const { format_login, format_data } = require('../utils/res_data')
const db = require('../db/db')
const tokens = require('../utils/tokens')
const { checkUserName, checkPwd, checkEmail } = require('../utils/validators')
const { tools: { encrypt } } = require('../utils')
const config = require('../../config')
const moment = require('moment')
const { ad_user_role } = require('../db/db')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class ad_users {
  constructor() {
    // super()
  }
  /**
   * 登录操作
   * @param  {obejct} ctx 上下文对象
   */
  static async ad_sign_in(ctx) {
    let req_data = ctx.request.body

    try {
      if (!req_data.account) {
        throw new err_mess('请输入账户!')
      }
      if (!checkUserName(req_data.account)) {
        throw new err_mess('5-12个英文字符!')
      }
      if (!req_data.password) {
        throw new err_mess('请输入密码!')
      }
    } catch (err) {
      format_login(ctx, {
        state: 'error',
        message: err.message
      }, false)
      return false
    }

    let ad_user_findOne = await db.ad_user.findOne({ where: { account: req_data.account } })
    try {
      if (!ad_user_findOne) {
        throw new err_mess('用户不存在!')
      }
      if (!(encrypt(req_data.password, config.encrypt_key) === ad_user_findOne.password)) {
        throw new err_mess('密码错误!')
      }
      if (!ad_user_findOne.enable) {
        throw new err_mess('您已被限制登录!')
      }
    } catch (err) {
      format_login(ctx, {
        state: 'error',
        message: err.message
      }, false)
      return false
    }

    let find_user_role = await ad_user_role.findOne({ where: { uid: ad_user_findOne.uid } })
    let datas = { account: req_data.account, role_id: find_user_role ? find_user_role.role_id : '' }
    let token = tokens.setToken('cxh', 3000, datas)
    format_login(ctx, {
      state: 'success',
      message: '登录成功',
      token
    })

  }

  /**
   * 注册操作
   * @param   {obejct} ctx 上下文对象
   */
  static async create_admin_user(ctx) {
    const req_data = ctx.request.body

    try {
      if (!req_data.account) {
        throw new err_mess('请输入账户!')
      }
      if (!req_data.nickname) {
        throw new err_mess('请输入昵称!')
      }
      if (!checkUserName(req_data.account)) {
        throw new err_mess('账户须5-12个英文字符!')
      }
      if (!req_data.password) {
        throw new err_mess('请输入密码!')
      }
      if (!checkPwd(req_data.password)) {
        throw new err_mess('密码输入有误!')
      }
      if (!checkEmail(req_data.email)) {
        throw new err_mess('邮箱输入有误!')
      }
    } catch (err) {
      format_data(ctx, {
        state: 'error',
        message: err.message
      }, false)
      return false
    }

    let ad_user_findOne = await db.ad_user.findOne({
      where: {
        account: req_data.account
      }
    })

    if (ad_user_findOne) {
      format_data(ctx, {
        state: 'error',
        message: '账户已存在'
      }, false)
      return false
    }

    await db.ad_user.create({
      account: req_data.account,
      nickname: req_data.nickname,
      password: encrypt(req_data.password, config.encrypt_key),
      email: req_data.email,
      phone: req_data.phone,
      reg_time: moment().utc().utcOffset(+8).format('X'),
      reg_ip: ctx.request.ip,
      enable: req_data.enable || false
    }).then(function (p) {
      console.log('created.' + JSON.stringify(p))
      format_data(ctx, {
        state: 'success',
        message: '注册成功'
      })
    }).catch(function (err) {
      console.log('failed: ' + err)
      format_data(ctx, {
        state: 'error',
        message: '注册失败'
      })
    })
  }

  /**
   * 更新管理员用户
   * @param   {obejct} ctx 上下文对象
   */
  static async edit_admin_user(ctx) {
    const req_data = ctx.request.body

    await db.ad_user.update({
      account: req_data.account,
      nickname: req_data.nickname,
      password: encrypt(req_data.password, config.encrypt_key),
      email: req_data.email,
      phone: req_data.phone,
      enable: req_data.enable || false
    }, {
        where: {
          uid: req_data.uid//查询条件
        }
      }).then(function (p) {
        console.log('created.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '更新成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '更新失败'
        })
      })
  }

  /**
   * 获取用户列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_admin_user_list(ctx) {
    const res_data = ctx.query
    let page = res_data.page || 1
    let pageSize = res_data.pageSize || 10

    let ad_user_findAndCountAll = await db.ad_user.findAndCountAll({
      attributes: ['uid', 'account', 'nickname', 'email', 'phone', 'reg_time', 'last_sign_time', 'reg_ip', 'enable'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })

    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: ad_user_findAndCountAll.count,
        admin_user_list: ad_user_findAndCountAll.rows
      }
    })

  }

  /**
   * 删除用户
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_admin_user(ctx) {

    const req_data = ctx.request.body
    await db.ad_user.destroy({ 'where': { 'uid': req_data.uid } })
      .then(function (p) {
        console.log('created.' + JSON.stringify(p))
        format_data(ctx, {
          state: 'success',
          message: '删除管理员用户成功'
        })
      }).catch(function (err) {
        console.log('failed: ' + err)
        format_data(ctx, {
          state: 'error',
          message: '删除管理员用户失败'
        })
      })

  }

}

module.exports = ad_users