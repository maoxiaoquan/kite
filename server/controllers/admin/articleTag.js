const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const { createAdminSystemLog } = require('./adminSystemLog')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class ArticleTag {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建标签
   * @param   {object} ctx 上下文对象
   */
  static async createArticleTag (req, res, next) {
    const reqData = req.body

    try {
      let oneArticleTagName = await models.article_tag.findOne({
        where: { name: reqData.name }
      })
      if (oneArticleTagName) {
        throw new ErrorMessage('标签名已存在!')
      }
      let oneArticleTagEnName = await models.article_tag.findOne({
        where: { en_name: reqData.en_name }
      })
      if (oneArticleTagEnName) {
        throw new ErrorMessage('标签名英文已存在!')
      }

      await models.article_tag.create({
        name: reqData.name,
        en_name: reqData.en_name,
        icon: reqData.icon || '/default/img/tag.webp',
        description: reqData.description,
        enable: reqData.enable,
        is_push: reqData.is_push
      })
      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功创建了‘${reqData.name}’文章标签`
      })

      resAdminJson(res, {
        state: 'success',
        message: '标签创建成功'
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
   * 获取标签列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleTagList (req, res, next) {
    const { page = 1, pageSize = 10 } = req.query
    try {
      let { count, rows } = await models.article_tag.findAndCountAll({
        where: '', // 为空，获取全部，也可以自己添加条件
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
   * 获取所有标签操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleTagAll (req, res, next) {
    try {
      let articleTagAll = await models.article_tag.findAll({
        where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
      })
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          article_tag_all: articleTagAll
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
  static async updateArticleTag (req, res, next) {
    const reqData = req.body
    try {
      await models.article_tag.update(
        {
          name: reqData.name,
          en_name: reqData.en_name,
          icon: reqData.icon,
          description: reqData.description,
          enable: reqData.enable,
          is_push: reqData.is_push
        },
        {
          where: {
            tag_id: reqData.tag_id // 查询条件
          }
        }
      )
      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.tag_id}’的文章标签名字为‘${reqData.name}’`
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

  /**
   * 删除标签
   */
  static async deleteArticleTag (req, res, next) {
    const { tag_id } = req.body
    try {
      let oneArticleTag = await models.article_tag.findOne({
        where: { tag_id }
      })

      await models.article_tag.destroy({ where: { tag_id } })
      await createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 1,
        content: `成功删除了‘${oneArticleTag.name}’文章标签`
      })

      resAdminJson(res, {
        state: 'success',
        message: '删除用户成功'
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

module.exports = ArticleTag
