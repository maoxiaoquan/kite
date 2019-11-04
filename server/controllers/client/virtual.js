const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../utils/time')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction,
  userMessageActionText
} = require('../../utils/constant')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Virtual {
  /**
   * 获取用户消息
   * @param   {object} ctx 上下文对象
   */
  static async getVirtualList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let { user = '' } = ctx.request
    try {
      let allUserMessage = await models.user_message.findAll({
        // 获取所有未读消息id
        where: {
          is_read: false,
          uid: user.uid
        }
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
          'sender',
          await models.user.findOne({
            where: { uid: rows[i].sender_id },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        rows[i].setDataValue(
          'actionText',
          userMessageActionText[rows[i].action]
        )

        let content = rows[i].content && JSON.parse(rows[i].content)
        // 以上是公共的数据

        if (rows[i].action === userMessageAction.attention) {
          // 用户关注 所需要的数据已获取,无需处理
        } else if (rows[i].action === userMessageAction.comment) {
          // 评论
          if (rows[i].type === userMessageType.article) {
            // 文章评论
            rows[i].setDataValue(
              'article',
              await models.article.findOne({
                where: { aid: content.aid },
                attributes: ['aid', 'title']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.article_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'aid']
              })
            )
          } else if (rows[i].type === userMessageType.dynamic) {
            // 片刻评论
            rows[i].setDataValue(
              'dynamic',
              await models.dynamic.findOne({
                where: { id: content.dynamic_id },
                attributes: ['id', 'content']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.dynamic_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'dynamic_id']
              })
            )
          } else if (rows[i].type === userMessageType.books) {
            // 小书评论
            rows[i].setDataValue(
              'books',
              await models.books.findOne({
                where: { books_id: content.books_id },
                attributes: ['books_id', 'title']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.books_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'books_id']
              })
            )
          } else if (rows[i].type === userMessageType.book) {
            // 小书章节评论
            rows[i].setDataValue(
              'book',
              await models.book.findOne({
                where: { book_id: content.book_id },
                attributes: ['book_id', 'title', 'books_id']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.book_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
              })
            )
          }
        } else if (rows[i].action === userMessageAction.reply) {
          // 评论回复
          if (rows[i].type === userMessageType.article_comment) {
            // 文章回复
            rows[i].setDataValue(
              'replyComment',
              await models.article_comment.findOne({
                where: { id: content.reply_id },
                attributes: ['id', 'content', 'status', 'aid']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.article_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'aid']
              })
            )
          } else if (rows[i].type === userMessageType.dynamic_comment) {
            // 片刻回复
            rows[i].setDataValue(
              'replyComment',
              await models.dynamic_comment.findOne({
                where: { id: content.reply_id },
                attributes: ['id', 'content', 'status', 'dynamic_id']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.dynamic_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'dynamic_id']
              })
            )
          } else if (rows[i].type === userMessageType.books_comment) {
            // 小书回复
            rows[i].setDataValue(
              'replyComment',
              await models.books_comment.findOne({
                where: { id: content.reply_id },
                attributes: ['id', 'content', 'status', 'books_id']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.books_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'books_id']
              })
            )
          } else if (rows[i].type === userMessageType.book_comment) {
            // 小书章节回复
            rows[i].setDataValue(
              'replyComment',
              await models.book_comment.findOne({
                where: { id: content.reply_id },
                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
              })
            )
            rows[i].setDataValue(
              'comment',
              await models.book_comment.findOne({
                where: { id: content.comment_id },
                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
              })
            )
          }
        } else if (rows[i].action === userMessageAction.like) {
          rows[i].setDataValue(
            'article',
            await models.article.findOne({
              where: { aid: content.aid },
              attributes: ['aid', 'title', 'uid']
            })
          )
        } else if (rows[i].action === userMessageAction.thumb) {
          rows[i].setDataValue(
            'dynamic',
            await models.dynamic.findOne({
              where: { id: content.dynamic_id },
              attributes: ['id', 'content', 'uid']
            })
          )
        }
      }

      if (allUserMessage.length > 0) {
        // 修改未读为已读
        await models.user_message.update(
          {
            is_read: true
          },
          {
            where: {
              is_read: false,
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
          list: rows,
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
}

module.exports = Virtual
