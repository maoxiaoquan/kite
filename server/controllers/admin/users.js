const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
class Users {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getUserList (req, res, next) {
    const { page = 1, pageSize = 10 } = req.params
    try {
      let { count, rows } = await models.user.findAndCountAll({
        attributes: [
          'uid',
          'nickname',
          'last_sign_time',
          'reg_ip',
          'user_role_ids',
          'ban_dt',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'ft_ban_dt',
          await moment(rows[i].ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')
        )

        rows[i].setDataValue(
          'user_info',
          await models.user_info.findOne({
            where: {
              uid: rows[i].uid
            }
          })
        )
      }

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          user_list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 更新用户
   * @param   {object} ctx 上下文对象
   */
  static async editUser (req, res, next) {
    const { uid, nickname, user_role_ids, enable } = req.body
    try {
      await models.user.update(
        {
          nickname: nickname,
          user_role_ids: user_role_ids ? user_role_ids.join(',') : '',
          enable: enable || false
        },
        {
          where: {
            uid: uid // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除用户
   * @param   {object} ctx 上下文对象
   * 删除用户先判断用户是否有文章，有则，同时删除文章
   * 无关联则直接删除用户，有关联则开启事务同时删除用户所含有的文章
   * 管理员对角色是一多一的关系
   */
  static async deleteUser (req, res, next) {
    const { uid } = req.body
    try {
      let oneArticle = await models.article.findOne({ where: { uid } })

      if (!oneArticle) {
        /* 无关联 */
        await models.user.destroy({ where: { uid } })
        resAdminJson(res, {
          state: 'success',
          message: '删除用户成功'
        })
      } else {
        /* 有关联 */
        // 创建事务
        await models.sequelize.transaction(transaction => {
          // 在事务中执行操作
          return models.user
            .destroy({ where: { uid } }, { transaction })
            .then(deleteAdminUser => {
              return models.article.destroy(
                { where: { uid } },
                { ...transaction }
              )
            })
        })
        resAdminJson(res, {
          state: 'success',
          message: '删除用户成功,同时删除用户所有文章'
        })
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 获取需要审核的头像
   * @param   {object} ctx 上下文对象
   */
  static async getAvatarReview (req, res, next) {
    const { page = 1, pageSize = 10, status = 1 } = req.params
    try {
      let { count, rows } = await models.user_info.findAndCountAll({
        where: {
          avatar_review_status: status
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 审核用户头像
   * @param   {object} ctx 上下文对象
   */
  static async set_avatar_review (req, res, next) {
    try {
      const { uid, status } = req.body
      let oneUserInfo = await models.user_info.findOne({
        where: {
          uid: uid // 查询条件
        }
      })
      if (status === '2') {
        // 审核成功
        await models.user.update(
          {
            avatar: oneUserInfo.avatar_review
          },
          {
            where: {
              uid: uid // 查询条件
            }
          }
        )
        await models.user_info.update(
          {
            avatar_review_status: status
          },
          {
            where: {
              uid: uid // 查询条件
            }
          }
        )
        resAdminJson(res, {
          state: 'success',
          message: '更新成功'
        })
      } else if (status === '3' || status === '1') {
        // 审核失败或者其他
        await models.user_info.update(
          {
            avatar_review_status: status
          },
          {
            where: {
              uid: uid // 查询条件
            }
          }
        )
        resAdminJson(res, {
          state: 'success',
          message: '更新成功'
        })
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 禁言用户
   * @param   {object} ctx 上下文对象
   */
  static async banUser (req, res, next) {
    try {
      const { uid, ban_dt } = req.body
      let setUpdate = {}

      ban_dt && (setUpdate['ban_dt'] = new Date(ban_dt))
      // 审核成功
      await models.user.update(
        {
          ...setUpdate
        },
        {
          where: {
            uid: uid // 查询条件
          }
        }
      )

      resAdminJson(res, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Users
