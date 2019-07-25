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
  static async createArticleTag (ctx) {
    const reqData = ctx.request.body

    try {
      let oneArticleTagName = await models.articleTag.findOne({
        where: { article_tag_name: reqData.article_tag_name }
      })
      if (oneArticleTagName) {
        throw new ErrorMessage('标签名已存在!')
      }
      let oneArticleTagEnName = await models.articleTag.findOne({
        where: { article_tag_en_name: reqData.article_tag_en_name }
      })
      if (oneArticleTagEnName) {
        throw new ErrorMessage('标签名英文已存在!')
      }

      await models.articleTag.create({
        article_tag_name: reqData.article_tag_name,
        article_tag_en_name: reqData.article_tag_en_name,
        article_tag_icon: reqData.article_tag_icon || '/default/img/tag.webp',
        article_tag_description: reqData.article_tag_description,
        enable: reqData.enable
      })
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${reqData.article_tag_name}’文章标签`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '标签创建成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
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
  static async getArticleTagList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await models.articleTag.findAndCountAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
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
      return false
    }
  }

  /**
   * 获取所有标签操作
   * @param   {object} ctx 上下文对象
   */
  static async getArticleTagAll (ctx) {
    try {
      let articleTagAll = await models.articleTag.findAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description',
          'enable'
        ],
        where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
      })
      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          article_tag_all: articleTagAll
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

  /**
   * 更新标签
   * @param   {object} ctx 上下文对象
   */
  static async updateArticleTag (ctx) {
    const reqData = ctx.request.body
    try {
      await models.articleTag.update(
        {
          article_tag_name: reqData.article_tag_name,
          article_tag_en_name: reqData.article_tag_en_name,
          article_tag_icon: reqData.article_tag_icon,
          article_tag_description: reqData.article_tag_description,
          enable: reqData.enable
        },
        {
          where: {
            article_tag_id: reqData.article_tag_id // 查询条件
          }
        }
      )
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.article_tag_id}’的文章标签名字为‘${reqData.article_tag_name}’`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '更新标签成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除标签
   */
  static async deleteArticleTag (ctx) {
    const { article_tag_id } = ctx.request.body
    try {
      let oneArticleTag = await models.articleTag.findOne({
        where: { article_tag_id }
      })

      await models.articleTag.destroy({ where: { article_tag_id } })
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功删除了‘${oneArticleTag.article_tag_name}’文章标签`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '删除用户成功'
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

module.exports = ArticleTag
