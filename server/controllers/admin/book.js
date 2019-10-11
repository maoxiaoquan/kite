const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Book {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getBookList (ctx) {
    const { page = 1, pageSize = 10, title, status } = ctx.request.body

    let whereParams = {} // 定义查询条件

    title && (whereParams['title'] = { [Op.like]: `%${title}%` })
    status && (whereParams['status'] = status)

    try {
      let { count, rows } = await models.book.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date)
            .format('YYYY-MM-DD H:m:s')
            .toLocaleString()
        )
        let oneBooks = await models.books.findOne({
          where: { books_id: rows[i].books_id }
        })

        if (oneBooks) {
          rows[i].setDataValue(
            'books',
            await models.books.findOne({
              where: { books_id: rows[i].books_id }
            })
          )
        }

        rows[i].setDataValue(
          'commentCount',
          await models.book_comment.count({
            where: { book_id: rows[i].book_id }
          })
        )

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
   * 更新小书章节
   * @param   {object} ctx 上下文对象
   */
  static async updateBook (ctx) {
    const { book_id, status, rejection_reason } = ctx.request.body
    try {
      await models.book.update(
        {
          status,
          rejection_reason
        },
        {
          where: {
            book_id: book_id // 查询条件
          }
        }
      )
      resAdminJson(ctx, {
        state: 'success',
        message: '更新小书章节成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除小书章节
   * @param   {object} ctx 上下文对象
   * 删除小书章节判断是否有小书章节
   * 无关联则直接删除小书章节，有关联则开启事务同时删除与小书章节的关联
   */
  static async deleteBook (ctx) {
    const { book_id } = ctx.request.body
    try {
      let oneBook = await models.book.findOne({ where: { book_id } })
      if (oneBook) {
        await models.book.destroy({ where: { book_id } })
        resAdminJson(ctx, {
          state: 'success',
          message: '删除小书章节成功'
        })
      } else {
        throw new ErrorMessage('删除小书章节失败!')
      }
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Book
