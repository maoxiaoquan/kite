const { sequelize, user, article } = require('../models')
const { format_login, format_data } = require('../utils/res_data')
const { tools: { encrypt } } = require('../utils')
const config = require('../../config')
const moment = require('moment')


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


  /**
 * 删除用户
 * @param   {obejct} ctx 上下文对象
 * 删除用户先判断用户是否有文章，有则，同时删除文章
 * 无关联则直接删除用户，有关联则开启事务同时删除用户所含有的文章
 * 管理员对角色是一多一的关系
 */
  static async delete_user(ctx) {

    const { uid } = ctx.request.body

    let find_article = await article.findOne({ where: { uid } })

    if (!find_article) { /* 无关联 */
      await user.destroy({ 'where': { uid } })
        .then(function (p) {
          format_data(ctx, {
            state: 'success',
            message: '删除用户成功'
          })
        }).catch(function (err) {
          format_data(ctx, {
            state: 'error',
            message: '删除用户失败'
          })
        })
    } else {   /* 有关联 */
      // 创建事务
      await sequelize.transaction(function (transaction) {
        // 在事务中执行操作
        return user.destroy({ where: { uid } }, { transaction })
          .then(function (delete_admin_user) {
            return article.destroy({ where: { uid } }, { ...transaction })
          });

      }).then(function (results) {
        format_data(ctx, {
          state: 'success',
          message: '删除用户成功,同时删除用户所有文章'
        })
      }).catch(function (err) {
        format_data(ctx, {
          state: 'error',
          message: '删除用户失败,同时回滚所有操作'
        })
      });

    }

  }

}

module.exports = Users