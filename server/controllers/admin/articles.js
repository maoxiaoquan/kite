const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const moment = require('moment')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Articles {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleList (req, res, next) {
    const {
      page = 1,
      pageSize = 10,
      title,
      source,
      status,
      type
    } = req.body

    let whereParams = {} // 定义查询条件

    title && (whereParams['title'] = { [Op.like]: `%${title}%` })
    source && (whereParams['source'] = source)
    status && (whereParams['status'] = status)
    type && (whereParams['type'] = type)

    try {
      let { count, rows } = await models.article.findAndCountAll({
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
   * 更新文章
   * @param   {object} ctx 上下文对象
   */
  static async editArticle (req, res, next) {
    const { aid, status, type, source, rejection_reason } = req.body
    try {
      await models.article.update(
        {
          status,
          type,
          source,
          rejection_reason
        },
        {
          where: {
            aid: aid // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新文章成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除文章
   * @param   {object} ctx 上下文对象
   * 删除文章判断是否有文章
   * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
   */
  static async deleteArticle (req, res, next) {
    const { aid } = req.body
    try {
      let oneArticle = await models.article.findOne({ where: { aid } })
      if (oneArticle) {
        await models.article.destroy({ where: { aid } })
        resAdminJson(res, {
          state: 'success',
          message: '删除文章成功'
        })
      } else {
        throw new ErrorMessage('删除文章失败!')
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

module.exports = Articles
