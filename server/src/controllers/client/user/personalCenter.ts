const models = require('../../../../../db/mysqldb/index')
import moment from 'moment'
const { render, resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  modelAction,
  virtualType,
  modelType
} = require('../../../utils/constant')

const { TimeNow, TimeDistance } = require('../../../utils/time')

class PersonalCenter {
  /**
   * 用户个人中心个人文章列表render
   * @param   {object} ctx 上下文对象
   */
  static async userMyArticle(req: any, res: any, next: any) {
    let uid = req.query.uid
    let blog_id = req.query.blog_id || 'all'
    let type = req.query.type || '1'
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let whereParams: any = {
      uid,
      type,
      status: {
        [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
      }
    }
    try {
      blog_id !== 'all' && (whereParams.blog_ids = blog_id)

      let { count, rows } = await models.article.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        let oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: rows[i].blog_ids }
        })

        if (oneArticleBlog && ~[2, 4].indexOf(oneArticleBlog.status)) {
          rows[i].setDataValue('article_blog', oneArticleBlog)
        }

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
              }
            })
          )
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: 'home',
        data: {
          count: count,
          blog_id,
          page,
          pageSize,
          list: rows
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户个人中心用户关注用户render
   * @param   {object} ctx 上下文对象
   */
  static async getUserAttentionList(req: any, res: any, next: any) {
    let uid = req.query.uid
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let any = req.query.any || 'me'
    let whereParmas = {}
    try {
      if (any === 'me') {
        whereParmas = {
          uid: uid,
          type: modelType.user,
          is_associate: true
        }
      } else {
        whereParmas = {
          associate_id: uid,
          type: modelType.user,
          is_associate: true
        }
      }

      let { count, rows } = await models.attention.findAndCountAll({
        where: whereParmas, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: any === 'me' ? rows[i].associate_id : rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'userAttentionIds',
          await models.attention.findAll({
            where: {
              associate_id: any === 'me' ? rows[i].associate_id : rows[i].uid,
              type: modelType.user,
              is_associate: true
            }
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: '获取列表成功',
        data: {
          count,
          page,
          pageSize,
          list: rows,
          any
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户like文章render
   * @param   {object} ctx 上下文对象
   */
  static async getUserLikeArticleList(req: any, res: any, next: any) {
    let uid = req.query.uid
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    try {
      let allUserLikeArticle = await models.like
        .findAll({
          where: { uid, is_associate: true, type: modelType.article }
        })
        .then((data: any) => {
          return data.map((item: any, key: any) => {
            return item.associate_id
          })
        })

      let where_params = { aid: { [Op.in]: allUserLikeArticle } }

      let { count, rows } = await models.article.findAndCountAll({
        where: where_params, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
              }
            })
          )
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: 'home',
        data: {
          count: count,
          page,
          pageSize,
          article_list: rows
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async getDynamicListMe(req: any, res: any, next: any) {
    const { uid } = req.query
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let whereParams = {} // 查询参数
    let orderParams = [['create_date', 'DESC']] // 排序参数

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        uid,
        status: {
          [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
        }
      }

      let { count, rows } = await models.dynamic.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )

        rows[i].setDataValue(
          'topic',
          rows[i].topic_ids
            ? await models.dynamic_topic.findOne({
              where: { topic_id: rows[i].topic_ids }
            })
            : ''
        )

        rows[i].setDataValue(
          'thumbCount',
          await models.thumb.count({
            where: {
              associate_id: rows[i].id,
              is_associate: true,
              type: modelType.dynamic
            }
          })
        )

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'userAttentionIds',
          await models.attention.findAll({
            where: {
              uid: rows[i].uid || '',
              type: modelType.user,
              is_associate: true
            }
          })
        )
      }

      if (rows) {
        resClientJson(res, {
          state: 'success',
          message: '数据返回成功',
          data: {
            count,
            page,
            pageSize,
            list: rows
          }
        })
      } else {
        resClientJson(res, {
          state: 'error',
          message: '数据返回错误，请再次刷新尝试'
        })
      }
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户个人中心个人专栏列表
   * @param   {object} ctx 上下文对象
   */
  static async userArticleBlogList(req: any, res: any, next: any) {
    let uid = req.query.uid
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let whereParams = {
      uid
    }
    try {
      let { count, rows } = await models.article_blog.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['update_date', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue('update_dt', await TimeDistance(rows[i].update_dt))

        rows[i].setDataValue(
          'articleCount',
          await models.article.count({
            where: { blog_ids: rows[i].blog_id }
          })
        )

        rows[i].setDataValue(
          'likeCount',
          await models.collect.count({
            where: {
              associate_id: rows[i].blog_id,
              is_associate: true,
              type: modelType.article_blog
            }
          })
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
            })
          )
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        rows[i].setDataValue(
          'likeUserIds',
          await models.collect.findAll({
            where: {
              associate_id: rows[i].blog_id,
              is_associate: true,
              type: modelType.article_blog
            }
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: '获取用户个人专栏成功列表',
        data: {
          count: count,
          page,
          pageSize,
          list: rows
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 用户个人中心个人小书列表
   * @param   {object} ctx 上下文对象
   */
  static async userBooksList(req: any, res: any, next: any) {
    let uid = req.query.uid
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let whereParams = {
      uid,
      status: {
        [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
      }
    }
    try {
      let { count, rows } = await models.books.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['update_date', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue('update_dt', await TimeDistance(rows[i].update_dt))

        rows[i].setDataValue(
          'bookCount',
          await models.book.count({
            where: { books_id: rows[i].books_id }
          })
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
            })
          )
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: '获取用户个人小书列表',
        data: {
          count,
          page,
          pageSize,
          list: rows
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

export default PersonalCenter
