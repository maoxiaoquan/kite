const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')

class AdminIndex {
  static async adminIndexStatistics (ctx) {
    try {
      const adminUserCount = await models.admin_user.count() // 后台用户统计
      const userCount = await models.user.count() // 前台用户统计

      // 无需审核系列
      // ----------------------------------文章统计
      const allArticleCount = await models.article.count() // 文章统计
      const noReviewArticleCount = await models.article.count({
        // 无需审核文章统计
        where: {
          status: 6
        }
      })
      const reviewArticleCount = await models.article.count({
        // 待审核文章统计
        where: {
          status: 1
        }
      })
      const reviewFailArticleCount = await models.article.count({
        // 审核失败文章统计
        where: {
          status: 3
        }
      })

      // ------------------------------------------文章评论统计
      const allCommentCount = await models.article_comment.count() // 评论统计

      const noReviewArticleCommentCount = await models.article_comment.count({
        where: {
          status: 5
        }
      }) // 无需审核评论统计

      const reviewArticleCommentCount = await models.article_comment.count({
        where: {
          status: 1
        }
      }) // 待审核评论统计

      const reviewFailArticleCommentCount = await models.article_comment.count({
        where: {
          status: 3
        }
      }) // 审核失败评论统计

      // -----------------------------------动态统计
      const allDynamicCount = await models.dynamic.count() // 全部动态统计

      const noReviewDynamicCount = await models.dynamic.count({
        where: {
          status: 4
        }
      }) // 无需审核动态统计

      const reviewDynamicCount = await models.dynamic.count({
        where: {
          status: 1
        }
      }) // 待审核动态统计

      const reviewFailDynamicCount = await models.dynamic.count({
        where: {
          status: 3
        }
      }) // 审核失败动态统计

      // ------------------------------------------文章评论统计
      const allDynamicCommentCount = await models.dynamic_comment.count() // 评论统计

      const noReviewDynamicCommentCount = await models.dynamic_comment.count({
        where: {
          status: 5
        }
      }) // 无需审核评论统计

      const reviewDynamicCommentCount = await models.dynamic_comment.count({
        where: {
          status: 1
        }
      }) // 待审核评论统计

      const reviewFailDynamicCommentCount = await models.dynamic_comment.count({
        where: {
          status: 3
        }
      }) // 审核失败评论统计

      // -----------------------------------个人专栏统计
      const allArticleBlogCount = await models.article_blog.count() // 全部个人专栏统计

      const noReviewArticleBlogCount = await models.article_blog.count({
        where: {
          status: 4
        }
      }) // 无需审核个人专栏统计

      const reviewArticleBlogCount = await models.article_blog.count({
        where: {
          status: 1
        }
      }) // 待审核个人专栏统计

      const reviewFailArticleBlogCount = await models.article_blog.count({
        where: {
          status: 3
        }
      }) // 审核失败个人专栏统计

      const userAll = await models.user.findAll({
        limit: 10, // 每页限制返回的数据条数
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
        order: [['create_timestamp', 'desc']]
      })

      const articleAll = await models.article.findAll({
        limit: 10, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      const commentAll = await models.article_comment.findAll({
        limit: 10, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (const i in articleAll) {
        articleAll[i].setDataValue(
          'create_dt',
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
          'create_dt',
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
          articleCount: {
            // 全部文章统计
            allCount: allArticleCount || 0, // 全部文章统计
            noReviewCount: noReviewArticleCount || 0, // 无需审核文章统计
            reviewCount: reviewArticleCount || 0, // 待审核文章统计
            reviewFailCount: reviewFailArticleCount || 0 // 审核失败文章统计
          },
          articleCommentCount: {
            // 全部文章评论统计
            allCount: allCommentCount || 0, // 全部文章评论统计
            noReviewCount: noReviewArticleCommentCount || 0, // 无需审核文章评论统计
            reviewCount: reviewArticleCommentCount || 0, // 待审核文章评论统计
            reviewFailCount: reviewFailArticleCommentCount || 0 // 审核失败文章统计
          },
          dynamicCount: {
            // 全部动态统计
            allCount: allDynamicCount || 0, // 全部动态统计
            noReviewCount: noReviewDynamicCount || 0, // 无需审核动态统计
            reviewCount: reviewDynamicCount || 0, // 待审核动态统计
            reviewFailCount: reviewFailDynamicCount || 0 // 审核失败动态统计
          },
          dynamicCommentCount: {
            // 全部动态评论统计
            allCount: allDynamicCommentCount || 0, // 全部动态评论统计
            noReviewCount: noReviewDynamicCommentCount || 0, // 无需审核动态评论统计
            reviewCount: reviewDynamicCommentCount || 0, // 待审核动态评论统计
            reviewFailCount: reviewFailDynamicCommentCount || 0 // 审核失败动态统计
          },
          articleBlogCount: {
            // 全部个人专栏统计
            allCount: allArticleBlogCount || 0, // 全部个人专栏统计
            noReviewCount: noReviewArticleBlogCount || 0, // 无需审核个人专栏统计
            reviewCount: reviewArticleBlogCount || 0, // 待审核个人专栏统计
            reviewFailCount: reviewFailArticleBlogCount || 0 // 审核失败个人专栏统计
          },
          count: {
            admin_user_count: adminUserCount,
            user_count: userCount,
            article_count: allArticleCount,
            comment_count: allCommentCount
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
