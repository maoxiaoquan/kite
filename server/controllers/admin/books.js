const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Books {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getBooksList (req, res, next) {
    const { page = 1, pageSize = 10, title, status } = req.body

    let whereParams = {} // 定义查询条件

    title && (whereParams['title'] = { [Op.like]: `%${title}%` })
    status && (whereParams['status'] = status)

    try {
      let { count, rows } = await models.books.findAndCountAll({
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
   * 更新小书
   * @param   {object} ctx 上下文对象
   */
  static async updateBooks (req, res, next) {
    const { books_id, status, rejection_reason } = req.body
    try {
      await models.books.update(
        {
          status,
          rejection_reason
        },
        {
          where: {
            books_id: books_id // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新小书成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除小书
   * @param   {object} ctx 上下文对象
   * 删除小书判断是否有小书
   * 无关联则直接删除小书，有关联则开启事务同时删除与小书的关联
   */
  static async deleteBooks (req, res, next) {
    const { books_id } = req.body
    try {
      let oneBooks = await models.books.findOne({ where: { books_id } })
      if (oneBooks) {
        await models.books.destroy({ where: { books_id } })
        resAdminJson(res, {
          state: 'success',
          message: '删除小书成功'
        })
      } else {
        throw new ErrorMessage('删除小书失败!')
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Books
