const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const { TimeNow, TimeDistance } = require('../../utils/time')
const clientWhere = require('../../utils/clientWhere')

class Index {
  static async getIndex (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10
    let columnEnName = ctx.query.columnEnName || ''
    let sort = ctx.query.sort || 'newest'
    let whereArticleParams = {} // 查询参数
    let whereArticleColumnParams = {} // 查询参数
    let orderParams = [] // 排序参数

    try {
      // where
      whereArticleParams = {
        // 默认全部导入的专题
        type: clientWhere.article.type,
        ...clientWhere.article.otherList,
        is_public: clientWhere.article.isPublic
      }

      if (!columnEnName) {
        // 判断是否有专题
        let allArticleTagId = [] // 全部禁止某些文章标签推送的id
        let allArticleTag = await models.article_tag.findAll({
          where: {
            is_push: false
          } // 为空，获取全部，也可以自己添加条件
        })

        if (allArticleTag && allArticleTag.length > 0) {
          for (let item in allArticleTag) {
            allArticleTagId.push(allArticleTag[item].article_tag_id)
          }

          console.log('allArticleTag', allArticleTagId)
          whereArticleParams['article_tag_ids'] = {
            [Op.notRegexp]: `${allArticleTagId.join('|')}`
          }
        }
      } else {
        whereArticleColumnParams['article_column_en_name'] = columnEnName
        let oneArticleColumn = await models.article_column.findOne({
          attributes: [
            'article_column_id',
            'article_column_name',
            'article_column_icon',
            'article_tag_ids'
          ],
          where: whereArticleColumnParams // 为空，获取全部，也可以自己添加条件
        })

        // 判断专栏下方是否有专题
        columnEnName &&
          oneArticleColumn.article_tag_ids &&
          (whereArticleParams['article_tag_ids'] = {
            [Op.regexp]: `${oneArticleColumn.article_tag_ids
              .split(',')
              .join('|')}`
          })
      }

      // sort
      // hottest 全部热门:
      sort === 'hottest' && orderParams.push(['comment_count', 'DESC'])
      // monthlyHottest 本月最热:
      sort === 'monthlyHottest' &&
        (whereArticleParams['create_date'] = {
          [Op.between]: [
            new Date(TimeNow.showMonthFirstDay()),
            new Date(TimeNow.showMonthLastDay())
          ]
        })
      // newest 最新推荐:
      sort === 'newest' && orderParams.push(['create_date', 'DESC'])

      if (!sort || sort === 'monthlyHottest' || sort === 'weeklyHottest') {
        orderParams.push(['create_date', 'ASC'])
      }

      let { count, rows } = await models.article.findAndCountAll({
        where: whereArticleParams, // 为空，获取全部，也可以自己添加条件
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
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      /* for (let item in rows) {// 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_dt = await moment(rows[item].create_date).format('YYYY-MM-DD')
      rows[item].user = await models.user.findOne({
        where: {uid: rows[item].uid},
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
    } */

      if (rows) {
        resClientJson(ctx, {
          state: 'success',
          message: '数据返回成功',
          data: {
            count,
            page,
            pageSize,
            column_en_name: columnEnName,
            article_list: rows,
            sort
          }
        })
      } else {
        resClientJson(ctx, {
          state: 'error',
          message: '数据返回错误，请再次刷新尝试'
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

module.exports = Index
