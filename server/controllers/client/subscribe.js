const { render, home_resJson } = require('../../utils/res_data')
const moment = require('moment')
const models = require('../../../db/mysqldb/index')
const Op = require('sequelize').Op

class Subscribe {
  constructor () {}

  static async render_subscribe_tag (ctx) {

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let tag_name = ctx.query.tag_name

    let is_subscribe = ctx.query.is_subscribe || 1

    let find_subscribe_article_tag = ctx.session.uid
      ? await models.subscribe_article_tag
        .findAll({ where: { uid: ctx.session.uid } })
        .then(res => {
          return res.map((tag_item, tag_key) => {
            return tag_item.article_tag_id
          })
        })
      : []

    let find_where

    if (Number(is_subscribe) === 1) {
      /* all 的标签 */
      find_where = tag_name // 通过判断tag_name有无，是否是搜索
        ? {
          enable: 1,
          article_tag_name: { [Op.like]: `%${tag_name}%` }
        }
        : { enable: 1 }
    } else {
      /* 自己的的标签 */
      find_where = tag_name
        ? {
          enable: 1,
          article_tag_name: {
            [Op.like]: `%${tag_name}%`
          },
          article_tag_id: { in: find_subscribe_article_tag }
        }
        : {
          enable: 1,
          article_tag_id: { in: find_subscribe_article_tag }
        }
    }

    let { count, rows } = await models.article_tag
      .findAndCountAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_us_name',
          'article_tag_icon',
          'article_tag_icon_type',
          'article_tag_description'
        ],
        where: find_where, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize // 每页限制返回的数据条数
      })
      .then(res => {
        res.rows.map(async (item, key) => {
          item.subscribe_count = await models.subscribe_article_tag.count({
            where: { article_tag_id: item.article_tag_id }
          })
          item.article_count = await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${item.article_tag_id}%`
              }
            }
          })
          return item
        })
        return res
      })

    await home_resJson(ctx, {
      state: 'success',
      message: 'subscribe',
      data: {
        page,
        count,
        pageSize,
        tag_name,
        is_subscribe,
        subscribe_article_tag: find_subscribe_article_tag,
        article_tag_list: rows
      }
    })
  }

  static async post_subscribe_tag (ctx) {
    const { article_tag_id } = ctx.request.body

    let findone_subscribe_article_tag = await models.subscribe_article_tag.findOne(
      {
        where: {
          uid: ctx.session.uid,
          article_tag_id
        }
      }
    )

    if (findone_subscribe_article_tag) {
      /* 判断是否关注了，是则取消，否则添加 */

      await models.subscribe_article_tag
        .destroy({
          where: {
            uid: ctx.session.uid,
            article_tag_id
          }
        })
        .then(() => {
          home_resJson(ctx, {
            state: 'success',
            message: '取消关注文章标签成功'
          })
        })
        .catch(() => {
          home_resJson(ctx, {
            state: 'error',
            message: '取消关注文章标签失败'
          })
        })
    } else {
      await models.subscribe_article_tag
        .create({
          uid: ctx.session.uid,
          article_tag_id
        })
        .then(() => {
          home_resJson(ctx, {
            state: 'success',
            message: '关注文章标签成功'
          })
        })
        .catch(() => {
          home_resJson(ctx, {
            state: 'error',
            message: '关注文章标签失败'
          })
        })
    }
  }
}

module.exports = Subscribe
