const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../config')
const { TimeNow, TimeDistance } = require('../../utils/time')
const shortid = require('shortid')
const { lowdb } = require('../../../db/lowdb/index')

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
  static async getUserArticleBlogAll (ctx) {
    /* 获取所有文章专题 */
    let { uid } = ctx.query
    try {
      let allUserArticleBlog = await models.article_blog.findAll({
        where: {
          uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '获取当前用户个人专题成功',
        data: {
          list: allUserArticleBlog
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

  /**
   * 创建用户专题
   * @param   {object} ctx 上下文对象
   */
  static async createUserArticleBlog (ctx) {
    /* 创建用户专题 */
    let {
      blog_name,
      en_name,
      description,
      icon,
      is_public,
      enable,
      tag_ids
    } = ctx.request.body
    let { user = '' } = ctx.request
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

      let oneArticleTag = await models.article_tag.findOne({
        where: {
          article_tag_id: config.ARTICLE_TAG.dfOfficialExclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (~tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.article_tag_name}只有${website.website_name}管理团队才能使用`
          )
        }
      }

      if (oneUserArticleBlog) {
        throw new ErrorMessage('不能创建自己已有的专题')
      }

      await models.article_blog.create({
        name: blog_name,
        en_name: en_name || shortid.generate(),
        icon: icon || config.DF_ICON,
        description: description || '',
        uid: user.uid,
        enable: enable || false,
        is_public: is_public || false,
        tag_ids: tag_ids || '',
        status: 1
      })
      resClientJson(ctx, {
        state: 'success',
        message: '文章个人专栏创建成功'
      })
    } catch (err) {
      resClientJson(ctx, {
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
  static async updateUserArticleBlog (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request

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
          article_tag_id: config.ARTICLE_TAG.dfOfficialExclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (~resData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.article_tag_name}只有${website.website_name}管理团队才能使用`
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
        ? 4
        : 1

      await models.article_blog.update(
        {
          name: resData.blog_name,
          en_name: resData.en_name || shortid.generate(),
          icon: resData.icon || config.DF_ICON,
          description: resData.description || '',
          enable: resData.enable || false,
          is_public: resData.is_public || false,
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
      resClientJson(ctx, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resClientJson(ctx, {
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

  static async deleteUserArticleBlog (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.article_blog.destroy({
        where: {
          blog_id: resData.blog_id, // 查询条件
          uid: user.uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '删除用户个人专栏成功'
      })
    } catch (err) {
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 获取个人专栏详细信息信息

  static async getArticleBlogView (ctx) {
    let blogId = ctx.query.blogId
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
        await models.rss_article_blog.count({
          where: { blog_id: oneArticleBlog.blog_id }
        })
      )

      oneArticleBlog.setDataValue(
        'likeUserIds',
        await models.rss_article_blog.findAll({
          where: { blog_id: oneArticleBlog.blog_id, is_like: true }
        })
      )

      if (oneArticleBlog.tag_ids) {
        oneArticleBlog.setDataValue(
          'tag',
          await models.article_tag.findAll({
            where: {
              article_tag_id: { [Op.or]: oneArticleBlog.tag_ids.split(',') }
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
        await resClientJson(ctx, {
          state: 'success',
          message: 'success',
          data: {
            articleBlog: oneArticleBlog
          }
        })
      } else {
        await resClientJson(ctx, {
          state: 'success',
          message: '文章个人专栏不存在',
          data: {
            articleBlog: {}
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

  // 获取个人专栏所含有的文章
  static async getArticleBlogArticleList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 24
    let sort = ctx.query.sort
    let blogId = ctx.query.blogId
    let whereParams = {
      blog_ids: blogId
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

        if (rows[i].article_tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                article_tag_id: { [Op.or]: rows[i].article_tag_ids.split(',') }
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

      await resClientJson(ctx, {
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
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 公开的个人专栏列表

  static async getArticleBlogList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 24
    let sort = ctx.query.sort
    let tagId = ctx.query.tagId
    let columnEnName = ctx.query.columnEnName
    let tagIdArr = []
    let whereParams = {
      is_public: true,
      status: {
        [Op.or]: [2, 4]
      }
    }

    let orderParams = []

    if (columnEnName && columnEnName !== 'all') {
      if (!tagId) {
        let oneArticleColumn = await models.article_column.findOne({
          where: {
            article_column_en_name: columnEnName
          } // 为空，获取全部，也可以自己添加条件
        })
        tagIdArr = oneArticleColumn.article_tag_ids.split(',')
      } else {
        tagIdArr = [tagId]
      }
    }

    !sort && (orderParams = [['create_date', 'DESC']])
    sort === 'hot' && (orderParams = [['like_count', 'DESC']])

    tagIdArr.length > 0 &&
      (whereParams['tag_ids'] = {
        [Op.regexp]: `${tagIdArr.join('|')}`
      })

    sort === '7day' &&
      (whereParams['create_date'] = {
        [Op.between]: [
          new Date(TimeNow.showWeekFirstDay()),
          new Date(TimeNow.showWeekLastDay())
        ]
      })

    sort === '30day' &&
      (whereParams['create_date'] = {
        [Op.between]: [
          new Date(TimeNow.showMonthFirstDay()),
          new Date(TimeNow.showMonthLastDay())
        ]
      })

    try {
      let { count, rows } = await models.article_blog.findAndCountAll({
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

        rows[i].setDataValue(
          'articleCount',
          await models.article.count({
            where: { blog_ids: rows[i].blog_id }
          })
        )

        rows[i].setDataValue(
          'likeCount',
          await models.rss_article_blog.count({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )

        if (rows[i].tag_ids) {
          rows[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: { article_tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
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
          await models.rss_article_blog.findAll({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )
      }

      await resClientJson(ctx, {
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
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  // 订阅个人专栏
  static async setSubscribeArticleBlog (ctx) {
    const { blog_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneSubscribeArticleBlog = await models.rss_article_blog.findOne({
        where: {
          uid: user.uid,
          blog_id
        }
      })

      if (oneSubscribeArticleBlog) {
        /* 判断是否关注了 */
        type = oneSubscribeArticleBlog.is_like ? 'cancel' : 'attention'
        await models.rss_article_blog.update(
          {
            is_like: !oneSubscribeArticleBlog.is_like
          },
          {
            where: {
              uid: user.uid,
              blog_id
            }
          }
        )
      } else {
        type = 'attention'
        await models.rss_article_blog.create({
          uid: user.uid,
          blog_id,
          is_like: true
        })
      }

      let articleBlogRssCount = await models.rss_article_blog.count({
        where: {
          blog_id,
          is_like: true
        }
      })

      await models.article_blog.update(
        {
          like_count: articleBlogRssCount
        },
        {
          where: {
            blog_id
          }
        }
      )

      resClientJson(ctx, {
        state: 'success',
        message: type === 'attention' ? '关注个人专栏成功' : '取消个人专栏成功',
        data: {
          type
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

  // 获取用户like的专栏列表

  static async getLikeArticleBlogList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 24
    let { user = '' } = ctx.request
    let whereParams = {
      is_public: true,
      status: {
        [Op.or]: [2, 4]
      }
    }

    try {
      let { count, rows } = await models.rss_article_blog.findAndCountAll({
        where: { is_like: true, uid: user.uid }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize // 每页限制返回的数据条数
        // order: orderParams
      })
      for (let i in rows) {
        const oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: rows[i].blog_id, ...whereParams }
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
            where: { blog_ids: rows[i].blog_id }
          })
        )

        rows[i].setDataValue(
          'likeCount',
          await models.rss_article_blog.count({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )

        rows[i].setDataValue(
          'likeUserIds',
          await models.rss_article_blog.findAll({
            where: { blog_id: rows[i].blog_id, is_like: true }
          })
        )
      }
      // for (let i in rows) {
      //   rows[i].setDataValue(
      //     'create_dt',
      //     await TimeDistance(rows[i].create_date)
      //   )
      //   rows[i].setDataValue(
      //     'update_dt',
      //     await TimeDistance(rows[i].update_date)
      //   )

      //   rows[i].setDataValue(
      //     'articleCount',
      //     await models.article.count({
      //       where: { blog_ids: rows[i].blog_id }
      //     })
      //   )

      //   rows[i].setDataValue(
      //     'likeCount',
      //     await models.rss_article_blog.count({
      //       where: { blog_id: rows[i].blog_id, is_like: true }
      //     })
      //   )

      //   if (rows[i].tag_ids) {
      //     rows[i].setDataValue(
      //       'tag',
      //       await models.article_tag.findAll({
      //         where: { article_tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
      //       })
      //     )
      //   }

      //   rows[i].setDataValue(
      //     'user',
      //     await models.user.findOne({
      //       where: { uid: rows[i].uid },
      //       attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      //     })
      //   )

      //   rows[i].setDataValue(
      //     'likeUserIds',
      //     await models.rss_article_blog.findAll({
      //       where: { blog_id: rows[i].blog_id, is_like: true }
      //     })
      //   )
      // }

      await resClientJson(ctx, {
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
      resClientJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = dynamicBlog
