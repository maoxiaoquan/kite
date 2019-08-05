const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class dynamic {
  static async createDynamic (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (!reqData.content) {
        throw new ErrorMessage('请输入千言内容')
      }

      if (reqData.content.length > 1000) {
        throw new ErrorMessage('文章标题过长，请小于1000个字符')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布千言，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      let oneDynamicTopic = await models.dynamic_topic.findOne({
        where: {
          topic_id: config.ARTICLE_TAG.dfNoReviewDynamicId
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (~reqData.topic_id.indexOf(config.ARTICLE_TAG.dfNoReviewDynamicId)) {
        // 判断使用的是否是官方才能使用的动态话题
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          // 是的话再判断是否有权限，否则就弹出提示
          throw new ErrorMessage(
            `${oneDynamicTopic.name}只有${website.website_name}管理团队才能发布文章`
          )
        }
      }

      const result = reqData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)
      let $ = cheerio.load(reqData.content)

      let userRoleALL = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })

      let userAuthorityIds = ''
      userRoleALL.map(roleItem => {
        userAuthorityIds += roleItem.user_authority_ids + ','
      })

      let status = ~userAuthorityIds.indexOf(
        config.USER_AUTHORITY.dfNoReviewDynamicId
      ) // 4无需审核， 1审核中
        ? 4
        : 1

      await models.article.create({
        uid: user.uid,
        title: xss(reqData.title),
        excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
        content: xss(reqData.content) /* 主内容 */,
        origin_content: reqData.origin_content /* 源内容 */,
        source: reqData.source, // 来源 （1原创 2转载）
        cover_img: result ? result[2] : '',
        status, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败;4:回收站;5:已删除;6:无需审核)'
        type: reqData.type, // 类型 （1文章 2说说 3视频 4公告 ）
        user_blog_ids: reqData.user_blog_ids,
        article_tag_ids: reqData.article_tag_ids
      })

      resClientJson(ctx, {
        state: 'success',
        message: '文章创建成功'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
  static async dynamicTopicIndex (ctx) {
    // 获取首页侧栏动态列表
    try {
      let allDynamicTopic = await models.dynamic_topic.findAll({
        attributes: [
          'id',
          'topic_id',
          'name',
          'en_name',
          'icon',
          'description',
          'rss_count',
          'enable',
          'sort',
          'is_show',
          'enable'
        ],
        where: { enable: 1, is_show: 1 }, // 为空，获取全部，也可以自己添加条件
        order: [
          ['sort', 'ASC'] // asc
        ]
      })
      resClientJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          all: allDynamicTopic
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

  static async dynamicTopicList (ctx) {
    // 获取所有动态列表
    try {
      let allDynamicTopic = await models.dynamic_topic.findAll({
        attributes: [
          'id',
          'topic_id',
          'name',
          'en_name',
          'icon',
          'description',
          'rss_count',
          'enable',
          'sort',
          'is_show',
          'enable'
        ],
        where: { enable: 1 }, // 为空，获取全部，也可以自己添加条件
        order: [
          ['sort', 'ASC'] // asc
        ]
      })
      resClientJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          all: allDynamicTopic
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
}
module.exports = dynamic
