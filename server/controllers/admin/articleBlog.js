const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const { createAdminSystemLog } = require('./adminSystemLog')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class ArticleBlog {
  /**
   * 获取标签列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleBlogList (req, res, next) {
    let whereParams = {} // 定义查询条件
    const { page = 1, pageSize = 10, name, status } = req.query
    try {
      name && (whereParams['name'] = { [Op.like]: `%${name}%` })
      status && (whereParams['status'] = status)
      let { count, rows } = await models.article_blog.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
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
      return false
    }
  }

  /**
   * 更新标签
   * @param   {object} ctx 上下文对象
   */
  static async updateArticleBlog (req, res, next) {
    const reqData = req.body
    try {
      await models.article_blog.update(
        {
          status: reqData.status,
          rejection_reason: reqData.rejection_reason || ''
        },
        {
          where: {
            blog_id: reqData.blog_id // 查询条件
          }
        }
      )
      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.blog_id}’的个人专栏名字为‘${reqData.name}’`
      })

      resAdminJson(res, {
        state: 'success',
        message: '更新标签成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = ArticleBlog
