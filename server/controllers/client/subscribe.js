const { resClientJson } = require('../../utils/resData')
const moment = require('moment')
const models = require('../../../db/mysqldb/index')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')

class Subscribe {
  static async getArticleTagList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 24
    let tag_name = ctx.query.tag_name
    let whereParams = {
      enable: 1
    }
    try {
      tag_name &&
        (whereParams['article_tag_name'] = {
          [Op.like]: `%${tag_name}%`
        })

      let { count, rows } = await models.articleTag.findAndCountAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description',
          'attention_count'
        ],
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [
          ['attention_count', 'DESC'] // ASC
        ]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'subscribe_count',
          await models.subscribeArticleTag.count({
            where: { article_tag_id: rows[i].article_tag_id }
          })
        )
        rows[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${rows[i].article_tag_id}%`
              },
              ...clientWhere.article.otherList
            }
          })
        )
      }

      await resClientJson(ctx, {
        state: 'success',
        message: 'subscribe',
        data: {
          page,
          count,
          pageSize,
          tag_name,
          article_tag_list: rows
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

  static async getArticleTagListMy (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let { user = '' } = ctx.request
    let whereParams = {
      enable: 1
    }

    try {
      let allSubscribeArticleTag = await models.subscribeArticleTag.findAll({
        where: {
          uid: user.uid
        }
      })

      if (allSubscribeArticleTag.length > 0) {
        let myArticleTag = allSubscribeArticleTag.map(result => {
          return result.article_tag_id
        })

        myArticleTag &&
          (whereParams['article_tag_id'] = {
            [Op.regexp]: `${myArticleTag.join('|')}`
          })

        let { count, rows } = await models.articleTag.findAndCountAll({
          attributes: [
            'article_tag_id',
            'article_tag_name',
            'article_tag_en_name',
            'article_tag_icon',
            'article_tag_description',
            'attention_count'
          ],
          where: whereParams, // 为空，获取全部，也可以自己添加条件
          offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
          limit: pageSize, // 每页限制返回的数据条数
          order: [
            ['attention_count', 'DESC'] // ASC
          ]
        })

        for (let i in rows) {
          rows[i].setDataValue(
            'subscribe_count',
            await models.subscribeArticleTag.count({
              where: { article_tag_id: rows[i].article_tag_id }
            })
          )
          rows[i].setDataValue(
            'article_count',
            await models.article.count({
              where: {
                article_tag_ids: {
                  [Op.like]: `%${rows[i].article_tag_id}%`
                },
                ...clientWhere.article.otherList
              }
            })
          )
        }

        await resClientJson(ctx, {
          state: 'success',
          message: 'subscribe',
          data: {
            page,
            count,
            pageSize,
            article_tag_list: rows
          }
        })
      } else {
        await resClientJson(ctx, {
          state: 'success',
          message: 'subscribe',
          data: {
            page: 1,
            count: 0,
            pageSize: 25,
            article_tag_list: []
          }
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取当前用户订阅的标签成功
   * @param   {object} ctx 上下文对象
   */

  static async getSubscribeTagMyAll (ctx) {
    let { user = '' } = ctx.request
    try {
      let allSubscribeArticleTag = await models.subscribeArticleTag.findAll({
        where: {
          uid: user.uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '获取当前用户订阅的标签成功',
        data: {
          subscribe_article_tag: allSubscribeArticleTag
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

  static async setSubscribeTag (ctx) {
    const { article_tag_id } = ctx.request.body
    let { user = '' } = ctx.request
    try {
      let oneSubscribeArticleTag = await models.subscribeArticleTag.findOne({
        where: {
          uid: user.uid,
          article_tag_id
        }
      })

      let oneArticleTag = await models.articleTag.findOne({
        where: {
          article_tag_id
        }
      })

      if (oneSubscribeArticleTag) {
        /* 判断是否关注了，是则取消，否则添加 */

        await models.subscribeArticleTag.destroy({
          where: {
            uid: user.uid,
            article_tag_id
          }
        })

        await models.articleTag.update(
          {
            attention_count: oneArticleTag.attention_count - 1
          },
          {
            where: {
              article_tag_id
            }
          }
        )
        resClientJson(ctx, {
          state: 'success',
          message: '取消关注文章标签成功',
          data: {
            type: 'cancel'
          }
        })
      } else {
        await models.subscribeArticleTag.create({
          uid: user.uid,
          article_tag_id
        })

        await models.articleTag.update(
          {
            attention_count: oneArticleTag.attention_count + 1
          },
          {
            where: {
              article_tag_id
            }
          }
        )

        resClientJson(ctx, {
          state: 'success',
          message: '关注文章标签成功',
          data: {
            type: 'attention'
          }
        })
      }
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Subscribe
