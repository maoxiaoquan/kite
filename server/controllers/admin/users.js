const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
class Users {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getUserList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await models.user.findAndCountAll({
        attributes: [
          'uid',
          'nickname',
          'last_sign_time',
          'reg_ip',
          'user_role_ids',
          'article_ban_dt',
          'comment_ban_dt',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'ft_article_ban_dt',
          await moment(rows[i].article_ban_dt).format(
            'YYYY年MM月DD日 HH时mm分ss秒'
          )
        )
        rows[i].setDataValue(
          'ft_comment_ban_dt',
          await moment(rows[i].comment_ban_dt).format(
            'YYYY年MM月DD日 HH时mm分ss秒'
          )
        )
      }

      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          user_list: rows
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 更新用户
   * @param   {object} ctx 上下文对象
   */
  static async editUser (ctx) {
    const { uid, nickname, user_role_ids, enable } = ctx.request.body
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
      resAdminJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
  static async deleteUser (ctx) {
    const { uid } = ctx.request.body
    try {
      let oneArticle = await models.article.findOne({ where: { uid } })

      if (!oneArticle) {
        /* 无关联 */
        await models.user.destroy({ where: { uid } })
        resAdminJson(ctx, {
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
        resAdminJson(ctx, {
          state: 'success',
          message: '删除用户成功,同时删除用户所有文章'
        })
      }
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 获取需要审核的头像
   * @param   {object} ctx 上下文对象
   */
  static async getAvatarReview (ctx) {
    const { page = 1, pageSize = 10, status = 1 } = ctx.query
    try {
      let { count, rows } = await models.userInfo.findAndCountAll({
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

      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 审核用户头像
   * @param   {object} ctx 上下文对象
   */
  static async set_avatar_review (ctx) {
    try {
      const { uid, status } = ctx.request.body
      let oneUserInfo = await models.userInfo.findOne({
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
        await models.userInfo.update(
          {
            avatar_review_status: status
          },
          {
            where: {
              uid: uid // 查询条件
            }
          }
        )
        resAdminJson(ctx, {
          state: 'success',
          message: '更新成功'
        })
      } else if (status === '3' || status === '1') {
        // 审核失败或者其他
        await models.userInfo.update(
          {
            avatar_review_status: status
          },
          {
            where: {
              uid: uid // 查询条件
            }
          }
        )
        resAdminJson(ctx, {
          state: 'success',
          message: '更新成功'
        })
      }
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 禁言用户
   * @param   {object} ctx 上下文对象
   */
  static async banUser (ctx) {
    try {
      const { uid, article_ban_dt, comment_ban_dt } = ctx.request.body
      let setUpdate = {}

      article_ban_dt && (setUpdate['article_ban_dt'] = new Date(article_ban_dt))
      comment_ban_dt && (setUpdate['comment_ban_dt'] = new Date(comment_ban_dt))
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

      resAdminJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Users
