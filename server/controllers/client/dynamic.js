const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')
const { TimeNow } = require('../../utils/time')

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
          topic_id: config.DYNAMIC.dfOfficialTopic
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (
        reqData.topic_ids &&
        ~reqData.topic_ids.indexOf(config.DYNAMIC.dfOfficialTopic)
      ) {
        // 判断使用的是否是官方才能使用的动态话题
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          // 是的话再判断是否有权限，否则就弹出提示
          throw new ErrorMessage(
            `${oneDynamicTopic.name}只有${website.website_name}管理团队才能发布`
          )
        }
      }

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
      console.log('reqData', reqData)
      await models.dynamic.create({
        uid: user.uid,
        content: xss(reqData.content) /* 主内容 */,
        origin_content: reqData.content /* 源内容 */,
        attach: reqData.attach, // 摘要
        status, // '状态(1:审核中;2:审核通过;3:审核失败;4：无需审核)'
        type: reqData.type, // 类型 （1:默认动态;2:图片,3:连接，4：视频  ）
        topic_ids: reqData.topic_ids
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

  static async getDynamicList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10
    let topic_id = ctx.query.topic_id || ''
    let sort = ctx.query.sort || 'newest'
    let whereParams = {} // 查询参数
    let orderParams = [] // 排序参数

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        status: {
          [Op.or]: [2, 4]
        }
      }
      !~['hot', 'newest'].indexOf(topic_id) &&
        whereParams.push({ topic_ids: topic_id })
      topic_id === 'hot' && orderParams.push(['like_count', 'DESC'])
      // monthlyHottest 本月最热:
      // sort === 'monthlyHottest' &&
      //   (whereParams['create_date'] = {
      //     [Op.between]: [
      //       new Date(TimeNow.showMonthFirstDay()),
      //       new Date(TimeNow.showMonthLastDay())
      //     ]
      //   })
      // newest 最新推荐:
      topic_id === 'newest' && orderParams.push(['create_date', 'DESC'])

      if (!topic_id) {
        orderParams.push(['create_date', 'ASC'])
      }

      let { count, rows } = await models.dynamic.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_at',
          await moment(rows[i].create_date).format('YYYY-MM-DD')
        )
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      if (rows) {
        resClientJson(ctx, {
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
