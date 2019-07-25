const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')

class AdminIndex {
  static async adminIndexStatistics (ctx) {
    try {
      const adminUserCount = await models.adminUser.count() // 后台用户统计
      const userCount = await models.user.count() // 前台用户统计
      const articleCount = await models.article.count() // 文章统计
      const commentCount = await models.comment.count() // 评论统计

      const userAll = await models.user.findAll({
        limit: 10, // 每页限制返回的数据条数
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
        order: [['create_timestamp', 'desc']]
      })

      const articleAll = await models.article.findAll({
        limit: 10, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      const commentAll = await models.comment.findAll({
        limit: 10, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (const i in articleAll) {
        articleAll[i].setDataValue(
          'create_at',
          await moment(articleAll[i].create_date).format('YYYY-MM-DD H:m:s')
        )
        articleAll[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: articleAll[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      for (const i in commentAll) {
        commentAll[i].setDataValue(
          'create_at',
          await moment(commentAll[i].create_date).format('YYYY-MM-DD H:m:s')
        )
        commentAll[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: commentAll[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      resAdminJson(ctx, {
        state: 'success',
        message: '获取统计信息成功',
        data: {
          count: {
            admin_user_count: adminUserCount,
            user_count: userCount,
            article_count: articleCount,
            comment_count: commentCount
          },
          new_article: articleAll,
          new_user: userAll,
          new_comment: commentAll
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = AdminIndex
