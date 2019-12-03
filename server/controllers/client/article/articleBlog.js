const models = require('../../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../../utils/clientWhere')
const config = require('../../../config')
const { TimeNow, TimeDistance } = require('../../../utils/time')
const shortid = require('shortid')
const { lowdb } = require('../../../../db/lowdb/index')
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

/* 动态专题模块模块 */

// 获取动态专题详情

class dynamicBlog {
  /**
   * 获取所有文章专题get
   * @param   {object} ctx 上下文对象
   */
  static async getUserArticleBlogAll (req, res, next) {
    /* 获取所有文章专题 */
    let { uid } = req.query
    try {
      let allUserArticleBlog = await models.article_blog.findAll({
        where: {
          uid
        }
      })
      resClientJson(res, {
        state: 'success',
        message: '获取当前用户个人专题成功',
        data: {
          list: allUserArticleBlog
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
   * 创建用户专题
   * @param   {object} ctx 上下文对象
   */
  static async createUserArticleBlog (req, res, next) {
    /* 创建用户专题 */
    let { blog_name, en_name, description, icon, enable, tag_ids } = req.body
    let { user = '' } = req
    try {
      if (blog_name.length === 0) {
        throw new ErrorMessage('请输入文章专题名字')
      }

      let oneUserArticleBlog = await models.article_blog.findOne({
        where: {
          uid: user.uid,
          name: blog_name
        }
      })

      let userArticleBlogCount = await models.article_blog.count({
        where: {
          uid: user.uid
        }
      })

      if (userArticleBlogCount > 50) {
        throw new ErrorMessage('当前只开放，用户创建的个人专栏上限为50个')
      }

      if (en_name) {
        let enNameArticleBlog = await models.article_blog.findOne({
          where: {
            en_name
          }
        })
        if (enNameArticleBlog) {
          throw new ErrorMessage('英文名字已存在')
        }
        if (en_name.length > 60) {
          throw new ErrorMessage('英文名字小于60个字符')
        }
      }

      // 虚拟币判断是否可以进行继续的操作
      const isVirtual = await userVirtual.isVirtual({
        uid: user.uid,
        type: virtualType.article_blog,
        action: virtualAction.create
      })

      if (!isVirtual) {
        throw new ErrorMessage('贝壳余额不足！')
      }

      let oneArticleTag = await models.article_tag.findOne({
        where: {
          tag_id: config.ARTICLE_TAG.dfOfficialExclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()

      if (tag_ids) {
        if (~tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
          if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
            throw new ErrorMessage(
              `${oneArticleTag.name}只有${website.website_name}管理团队才能使用`
            )
          }
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
        config.ARTICLE_BLOG.dfNoReviewArticleBlogId
      )
        ? freeReview
        : pendingReview

      if (oneUserArticleBlog) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      const createArticleBlog = await models.article_blog.create({
        name: blog_name,
        en_name: en_name || shortid.generate(),
        icon: icon || config.DF_ICON,
        description: description || '',
        uid: user.uid,
        enable: enable || false,
        tag_ids: tag_ids || '',
        status
      })

      await userVirtual.setVirtual({
        uid: user.uid,
        associate: JSON.stringify({
          blog_id: createArticleBlog.blog_id
        }),
        type: virtualType.article_blog,
        action: virtualAction.create
      })

      resClientJson(res, {
        state: 'success',
        message: '文章个人专栏创建成功'
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
   * 更新用户专题
   * @param   {object} ctx 上下文对象
   */
  static async updateUserArticleBlog (req, res, next) {
    const resData = req.body
    let { user = '' } = req

    try {
      let oneUserArticleBlog = await models.article_blog.findOne({
        where: {
          name: resData.blog_name,
          blog_id: {
            [Op.ne]: resData.blog_id
          }
        }
      })

      if (oneUserArticleBlog) {
        throw new ErrorMessage('标题已存在')
      }
      if (resData.en_name) {
        let enNameArticleBlog = await models.article_blog.findOne({
          where: {
            en_name: resData.en_name,
            blog_id: {
              [Op.ne]: resData.blog_id
            }
          }
        })
        if (enNameArticleBlog) {
          throw new ErrorMessage('英文标题已存在')
        }

        if (resData.en_name.length > 60) {
          throw new ErrorMessage('英文标题小于60个字符')
        }
      }

      let oneArticleTag = await models.article_tag.findOne({
        where: {
          tag_id: config.ARTICLE_TAG.dfOfficialExclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (~resData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.name}只有${website.website_name}管理团队才能使用`
          )
        }
      }

      if (oneUserArticleBlog) {
        throw new ErrorMessage('不能修改自己已有的专题')
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
        config.ARTICLE_BLOG.dfNoReviewArticleBlogId
      )
        ? freeReview // 免审核
        : pendingReview // 待审核

      await models.article_blog.update(
        {
          name: resData.blog_name,
          en_name: resData.en_name || shortid.generate(),
          icon: resData.icon || config.DF_ICON,
          description: resData.description || '',
          enable: resData.enable || false,
          tag_ids: resData.tag_ids || '',
          status
        },
        {
          where: {
            blog_id: resData.blog_id, // 查询条件
            uid: user.uid
          }
        }
      )
      resClientJson(res, {
        state: 'success',
        message: '更新成功'
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
   * 删除用户文章专题
   * @param   {object} ctx 上下文对象
   */

  static async deleteUserArticleBlog (req, res, next) {
    const resData = req.body
    let { user = '' } = req
    try {
      await models.article_blog.destroy({
        where: {
          blog_id: resData.blog_id, // 查询条件
          uid: user.uid
        }
      })
      resClientJson(res, {
        state: 'success',
        message: '删除用户个人专栏成功'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 获取个人专栏详细信息信息

  static async getArticleBlogView (req, res, next) {
    let blogId = req.query.blogId
    try {
      let oneArticleBlog = await models.article_blog.findOne({
        where: {
          blog_id: blogId // 查询条件
        }
      })

      await models.article_blog.update(
        { read_count: Number(oneArticleBlog.read_count) + 1 },
        { where: { blog_id: blogId } } // 为空，获取全部，也可以自己添加条件
      )

      oneArticleBlog.setDataValue(
        'create_dt',
        await TimeDistance(oneArticleBlog.create_date)
      )
      oneArticleBlog.setDataValue(
        'update_dt',
        await TimeDistance(oneArticleBlog.update_date)
      )

      oneArticleBlog.setDataValue(
        'articleCount',
        await models.article.count({
          where: { blog_ids: oneArticleBlog.blog_id }
        })
      )

      oneArticleBlog.setDataValue(
        'likeCount',
        await models.collect.count({
          where: {
            associate_id: oneArticleBlog.blog_id,
            is_associate: true,
            type: modelType.article_blog
          }
        })
      )

      oneArticleBlog.setDataValue(
        'likeUserIds',
        await models.collect.findAll({
          where: {
            associate_id: oneArticleBlog.blog_id,
            is_associate: true,
            type: modelType.article_blog
          }
        })
      )

      if (oneArticleBlog.tag_ids) {
        oneArticleBlog.setDataValue(
          'tag',
          await models.article_tag.findAll({
            where: {
              tag_id: { [Op.or]: oneArticleBlog.tag_ids.split(',') }
            }
          })
        )
      }

      oneArticleBlog.setDataValue(
        'user',
        await models.user.findOne({
          where: { uid: oneArticleBlog.uid },
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        })
      )

      if (oneArticleBlog) {
        await resClientJson(res, {
          state: 'success',
          message: 'success',
          data: {
            articleBlog: oneArticleBlog
          }
        })
      } else {
        await resClientJson(res, {
          state: 'success',
          message: '文章个人专栏不存在',
          data: {
            articleBlog: {}
          }
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

  // 获取个人专栏所含有的文章
  static async getArticleBlogArticleList (req, res, next) {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 24
    let sort = req.query.sort
    let blogId = req.query.blogId

    let whereParams = {
      blog_ids: blogId,
      type: {
        [Op.or]: [articleType.article, articleType.note] // 文章和笔记
      },
      is_public: true, // 公开的文章
      status: {
        [Op.or]: [reviewSuccess, freeReview] // 审核成功、免审核
      }
    }

    let orderParams = []

    try {
      let { count, rows } = await models.article.findAndCountAll({
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
          'update_dt',
          await TimeDistance(rows[i].update_date)
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
        message: 'success',
        data: {
          page,
          count,
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

  // 获取用户like的专栏列表

  static async getLikeArticleBlogList (req, res, next) {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 24
    let uid = req.query.uid || ''
    let whereParams = {
      status: {
        [Op.or]: [reviewSuccess, freeReview]
      }
    }

    try {
      let { count, rows } = await models.collect.findAndCountAll({
        where: { is_associate: true, uid, type: modelType.article_blog }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
        // order: orderParams
      })
      for (let i in rows) {
        const oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: rows[i].associate_id, ...whereParams }
        })

        if (oneArticleBlog) {
          oneArticleBlog.setDataValue(
            'create_dt',
            await TimeDistance(oneArticleBlog.create_date)
          )

          oneArticleBlog.setDataValue(
            'update_dt',
            await TimeDistance(oneArticleBlog.update_date)
          )
          rows[i].setDataValue('articleBlog', oneArticleBlog)
        }

        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
        rows[i].setDataValue(
          'articleCount',
          await models.article.count({
            where: { blog_ids: rows[i].associate_id }
          })
        )

        rows[i].setDataValue(
          'likeCount',
          await models.collect.count({
            where: {
              associate_id: rows[i].associate_id,
              is_associate: true,
              type: modelType.article_blog
            }
          })
        )

        rows[i].setDataValue(
          'likeUserIds',
          await models.collect.findAll({
            where: {
              associate_id: rows[i].associate_id,
              is_associate: true,
              type: modelType.article_blog
            }
          })
        )
      }

      await resClientJson(res, {
        state: 'success',
        message: 'success',
        data: {
          page,
          count,
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

module.exports = dynamicBlog
