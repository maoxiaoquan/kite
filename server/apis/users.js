const { sequelize, user } = require('../models')
const { format_login, format_data } = require('../utils/res_data')
const { tools: { encrypt } } = require('../utils')
const config = require('../../config')

class Users {
  constructor() { }

  /**
   * 获取用户列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_user_list(ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    let { count, rows } = await user.findAndCountAll({
      attributes: ['uid', 'nickname', 'email', 'phone', 'reg_time', 'last_sign_time', 'reg_ip', 'enable'],
      where: '',//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * Number(pageSize),//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: Number(pageSize)//每页限制返回的数据条数
    })
    format_data(ctx, {
      state: 'success',
      message: '返回成功',
      data: {
        count: count,
        user_list: rows
      }
    })
  }


  /**
   * 更新用户
   * @param   {obejct} ctx 上下文对象
   */
  static async edit_user(ctx) {
    const { uid, nickname, password, account, enable } = ctx.request.body
    await user.update({
      avatar: 'http://oq33egsog.bkt.clouddn.com/avatar1.jpg',
      nickname: nickname,
      password: encrypt(password, config.encrypt_key),
      email: account,
      sex: '未知',
      enable: enable || false
    }, {
        where: {
          uid: uid//查询条件
        }
      })
      .then(function (p) {
        format_data(ctx, {
          state: 'success',
          message: '更新成功'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '更新失败'
        })
      })
  }

}

module.exports = Users