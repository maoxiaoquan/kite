const models = require('../../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../../utils/clientWhere')
const xss = require('xss')
const config = require('../../../config')
const { lowdb } = require('../../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../../utils/time')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  virtualAction,
  virtualType,
  modelType
} = require('../../../utils/constant')

const userVirtual = require('../../../common/userVirtual')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class dynamic {
  static async createDynamic (req, res, next) {
    let reqData = req.body
    console.log('reqData', req)
    let { user = '' } = req
    try {
      if (!reqData.content) {
        throw new ErrorMessage('请输入片刻内容')
      }

      if (reqData.content.length > 600) {
        throw new ErrorMessage('动态内容过长，请小于600个字符')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布片刻，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      // 虚拟币判断是否可以进行继续的操作
      const isVirtual = await userVirtual.isVirtual({
        uid: user.uid,
        type: virtualType.dynamic,
        action: virtualAction.create
      })

      if (!isVirtual) {
        throw new ErrorMessage('贝壳余额不足！')
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
        ? freeReview // 免审核
        : pendingReview // 待审核

      const createDynamic = await models.dynamic.create({
        uid: user.uid,
        content: xss(reqData.content) /* 主内容 */,
        origin_content: reqData.content /* 源内容 */,
        attach: reqData.attach, // 摘要
        status, // '状态(1:审核中;2:审核通过;3:审核失败;4：无需审核)'
        type: reqData.type, // 类型 （1:默认动态;2:图片,3:连接，4：视频  ）
        topic_ids: reqData.topic_ids
      })

      await userVirtual.setVirtual({
        uid: user.uid,
        associate: JSON.stringify({
          dynamic_id: createDynamic.id
        }),
        type: virtualType.dynamic,
        action: virtualAction.create
      })

      resClientJson(res, {
        state: 'success',
        message: '动态创建成功'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async getDynamicView (req, res, next) {
    let id = req.query.id || ''

    let whereParams = {} // 查询参数

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        id: id,
        status: {
          [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
        }
      }

      let oneDynamic = await models.dynamic.findOne({
        where: whereParams // 为空，获取全部，也可以自己添加条件
      })

      if (oneDynamic) {
        oneDynamic.setDataValue(
          'create_dt',
          await TimeDistance(oneDynamic.create_date)
        )

        oneDynamic.setDataValue(
          'topic',
          oneDynamic.topic_ids
            ? await models.dynamic_topic.findOne({
              where: { topic_id: oneDynamic.topic_ids }
            })
            : ''
        )

        oneDynamic.setDataValue(
          'thumbCount',
          await models.thumb.count({
            where: {
              associate_id: oneDynamic.id,
              type: modelType.dynamic,
              is_associate: true
            }
          })
        )

        if (
          oneDynamic.topic_ids &&
          config.DYNAMIC.dfTreeHole === oneDynamic.topic_ids
        ) {
          // 判断是不是树洞
          oneDynamic.setDataValue('user', {
            uid: 'tree',
            avatar: config.DF_ARTICLE_TAG_IMG,
            nickname: '树洞',
            sex: '',
            introduction: '树洞'
          })
        } else {
          oneDynamic.setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: oneDynamic.uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
        }
      }

      if (oneDynamic) {
        resClientJson(res, {
          state: 'success',
          message: '数据返回成功',
          data: {
            dynamic: oneDynamic
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

  static async getDynamicList (req, res, next) {
    console.log('req.query', req.query)
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10
    let topic_id = req.query.topic_id || ''
    let sort = req.query.sort || '' // 排序
    let whereDynamicParams = {} // 查询参数
    let orderParams = [] // 排序参数
    try {
      // sort
      // hottest 全部热门:

      whereDynamicParams = {
        status: {
          [Op.or]: [reviewSuccess, freeReview]
        }
      }
      console.log('sort', sort)
      if (!~['hot', 'newest'].indexOf(sort)) {
        whereDynamicParams['topic_ids'] = topic_id
      } else {
        // 属于最热或者推荐
        let allDynamicTopicId = [] // 全部禁止某些动态话题推送的id
        let allDynamicTopic = await models.dynamic_topic.findAll({
          where: {
            is_push: false
          } // 为空，获取全部，也可以自己添加条件
        })

        console.log('allDynamicTopic', allDynamicTopic)

        if (allDynamicTopic && allDynamicTopic.length > 0) {
          for (let item in allDynamicTopic) {
            allDynamicTopicId.push(allDynamicTopic[item].topic_id)
          }
          whereDynamicParams['topic_ids'] = {
            [Op.or]: {
              [Op.notIn]: allDynamicTopicId,
              [Op.is]: null
            }
          }
        }
      }

      sort === 'newest' && orderParams.push(['create_date', 'DESC'])
      sort === 'hot' && orderParams.push(['thumb_count', 'DESC'])
      // newest 最新推荐:
      if (!sort || sort === 'new') {
        orderParams.push(['create_date', 'DESC'])
      }

      console.log('whereDynamicParams', whereDynamicParams)

      let { count, rows } = await models.dynamic.findAndCountAll({
        where: whereDynamicParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in rows) {
        let topic = rows[i].topic_ids
          ? await models.dynamic_topic.findOne({
            where: { topic_id: rows[i].topic_ids }
          })
          : ''
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        rows[i].setDataValue('topic', topic)

        rows[i].setDataValue(
          'thumbCount',
          await models.thumb.count({
            where: {
              associate_id: rows[i].id,
              type: modelType.dynamic,
              is_associate: true
            }
          })
        )

        if (
          rows[i].topic_ids &&
          config.DYNAMIC.dfTreeHole === rows[i].topic_ids
        ) {
          // 判断是不是树洞
          rows[i].setDataValue('user', {
            uid: 'tree',
            avatar: config.DF_ARTICLE_TAG_IMG,
            nickname: '树洞',
            sex: '',
            introduction: '树洞'
          })
        } else {
          rows[i].setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: rows[i].uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
        }
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

  static async getDynamicListMe (req, res, next) {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10
    let whereParams = {} // 查询参数
    let orderParams = [['create_date', 'DESC']] // 排序参数
    let { user = '' } = req

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        uid: user.uid,
        status: {
          [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
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
              type: modelType.dynamic,
              is_associate: true
            }
          })
        )

        if (
          rows[i].topic_ids &&
          config.DYNAMIC.dfTreeHole === rows[i].topic_ids
        ) {
          // 判断是不是树洞
          rows[i].setDataValue('user', {
            uid: 'tree',
            avatar: config.DF_ARTICLE_TAG_IMG,
            nickname: '树洞',
            sex: '',
            introduction: '树洞'
          })
        } else {
          rows[i].setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: rows[i].uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
        }
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

  // 推荐动态
  static async recommendDynamicList (req, res, next) {
    let whereParams = {} // 查询参数
    let orderParams = [
      ['create_date', 'DESC'],
      ['comment_count', 'DESC']
    ] // 排序参数

    try {
      // sort
      // hottest 全部热门:
      whereParams = {
        status: {
          [Op.or]: [2, 4]
        },
        create_date: {
          [Op.between]: [
            new Date(TimeNow.showMonthFirstDay()),
            new Date(TimeNow.showMonthLastDay())
          ]
        }
      }

      let allDynamic = await models.dynamic.findAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        limit: 3, // 每页限制返回的数据条数
        order: orderParams
      })

      for (let i in allDynamic) {
        allDynamic[i].setDataValue(
          'create_dt',
          await TimeDistance(allDynamic[i].create_date)
        )
        allDynamic[i].setDataValue(
          'topic',
          allDynamic[i].topic_ids
            ? await models.dynamic_topic.findOne({
              where: { topic_id: allDynamic[i].topic_ids }
            })
            : ''
        )
        if (
          allDynamic[i].topic_ids &&
          config.DYNAMIC.dfTreeHole === allDynamic[i].topic_ids
        ) {
          // 判断是不是树洞
          allDynamic[i].setDataValue('user', {
            uid: 'tree',
            avatar: config.DF_ARTICLE_TAG_IMG,
            nickname: '树洞',
            sex: '',
            introduction: '树洞'
          })
        } else {
          allDynamic[i].setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: allDynamic[i].uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
        }
      }

      if (allDynamic) {
        resClientJson(res, {
          state: 'success',
          message: '数据返回成功',
          data: {
            list: allDynamic
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

  static async dynamicTopicIndex (req, res, next) {
    // 获取首页侧栏动态列表
    try {
      let allDynamicTopic = await models.dynamic_topic.findAll({
        where: { enable: 1, is_show: 1 }, // 为空，获取全部，也可以自己添加条件
        order: [
          ['sort', 'ASC'] // asc
        ]
      })
      resClientJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          list: allDynamicTopic
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

  static async dynamicTopicList (req, res, next) {
    // 获取所有动态列表
    try {
      let allDynamicTopic = await models.dynamic_topic.findAll({
        where: { enable: 1 }, // 为空，获取全部，也可以自己添加条件
        order: [
          ['sort', 'ASC'] // asc
        ]
      })

      for (let i in allDynamicTopic) {
        allDynamicTopic[i].setDataValue(
          'dynamicCount',
          await models.dynamic.count({
            where: { topic_ids: allDynamicTopic[i].topic_id }
          })
        )

        allDynamicTopic[i].setDataValue(
          'attention_count',
          await models.attention.count({
            where: {
              associate_id: allDynamicTopic[i].id,
              is_associate: true,
              type: modelType.dynamic_topic
            }
          })
        )
      }

      resClientJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          list: allDynamicTopic
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

  static async getDynamicTopicInfo (req, res, next) {
    const { topic_id } = req.query
    try {
      const oneDynamicTopic = await models.dynamic_topic.findOne({
        where: {
          topic_id
        }
      })
      oneDynamicTopic.setDataValue(
        'dynamic_count',
        await models.dynamic.count({
          where: { topic_ids: oneDynamicTopic.topic_id }
        })
      )

      oneDynamicTopic.setDataValue(
        'attention_count',
        await models.attention.count({
          where: {
            associate_id: oneDynamicTopic.id,
            is_associate: true,
            type: modelType.dynamic_topic
          }
        })
      )

      resClientJson(res, {
        state: 'success',
        data: {
          info: oneDynamicTopic
        },
        message: '动态专题详情获取成功'
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
   * 删除动态
   * @param   {object} ctx 上下文对象
   * 删除动态判断是否有动态
   * 无关联则直接删除动态，有关联则开启事务同时删除与动态的关联
   */
  static async deleteDynamic (req, res, next) {
    const { id } = req.query
    let { islogin = '', user = '' } = req

    try {
      let oneDynamic = await models.dynamic.findOne({
        where: {
          id,
          uid: user.uid // 查询条件
        }
      })

      if (!oneDynamic) {
        throw new ErrorMessage('动态不存在')
      }

      if (!islogin) {
        throw new ErrorMessage('请登录后尝试')
      }

      if (user.uid !== oneDynamic.uid) {
        throw new ErrorMessage('非法操作已禁止')
      }

      await models.dynamic.destroy({ where: { id } })

      resClientJson(res, {
        state: 'success',
        message: '删除动态成功'
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

module.exports = dynamic
