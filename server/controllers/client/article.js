const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../utils/time')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

function getNoMarkupStr (markupStr) {
  /* markupStr 源码</> */
  // console.log(markupStr);
  let noMarkupStr = markupStr
  /* 得到可视文本(不含图片),将&nbsp;&lt;&gt;转为空字符串和<和>显示,同时去掉了换行,文本单行显示 */
  // console.log("1--S" + noMarkupStr + "E--");
  noMarkupStr = noMarkupStr.replace(/(\r\n|\n|\r)/gm, '')
  /* 去掉可视文本中的换行,(没有用,上一步已经自动处理) */
  // console.log("2--S" + noMarkupStr + "E--");
  noMarkupStr = noMarkupStr.replace(/^\s+/g, '')
  /* 替换开始位置一个或多个空格为一个空字符串 */
  // console.log("3--S" + noMarkupStr + "E--");
  noMarkupStr = noMarkupStr.replace(/\s+$/g, '')
  /* 替换结束位置一个或多个空格为一个空字符串 */
  // console.log("4--S" + noMarkupStr + "E--");
  noMarkupStr = noMarkupStr.replace(/\s+/g, ' ')
  /* 替换中间位置一个或多个空格为一个空格 */
  // console.log("5--S" + noMarkupStr + "E--");
  return noMarkupStr
}

function getSubStr (string) {
  let str = ''
  let len = 0
  for (var i = 0; i < string.length; i++) {
    if (string[i].match(/[^\x00-\xff]/gi) != null) {
      len += 2
    } else {
      len += 1
    }
    if (len > 240) {
      /* 240为要截取的长度 */
      str += '...'
      break
    }
    str += string[i]
  }
  return str
}

class Article {
  /**
   * 新建文章post提交
   * @param   {object} ctx 上下文对象
   */
  static async createArticle (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (!reqData.title) {
        throw new ErrorMessage('请输入文章标题')
      }

      if (reqData.title.length > 150) {
        throw new ErrorMessage('文章标题过长，请小于150个字符')
      }

      if (!reqData.content) {
        throw new ErrorMessage('请输入文章内容')
      }

      if (!reqData.blog_ids) {
        throw new ErrorMessage('请选择个人专题')
      }

      if (reqData.source.length === 0 || reqData.source === null) {
        throw new ErrorMessage('请选择文章来源类型')
      }

      if (!reqData.article_tag_ids) {
        throw new ErrorMessage('请选择文章标签')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布文章，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
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
      if (
        ~reqData.article_tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)
      ) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.article_tag_name}只有${website.website_name}管理团队才能发布文章`
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
        config.USER_AUTHORITY.dfNoReviewArticleId
      )
        ? 6
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
        blog_ids: reqData.blog_ids,
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

  /**
   * 文章的标签页面
   * @param   {object} ctx 上下文对象
   */

  static async getArticleTag (ctx) {
    let qyData = ctx.query

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    try {
      let oneArticleTag = await models.article_tag.findOne({
        where: {
          article_tag_en_name: qyData.article_tag_en_name
        }
      })
      if (oneArticleTag) {
        let { count, rows } = await models.article.findAndCountAll({
          where: {
            article_tag_ids: {
              [Op.like]: `%${oneArticleTag.article_tag_id}%`
            },
            ...clientWhere.article.otherList // web 表示前台  公共文章限制文件
          }, // 为空，获取全部，也可以自己添加条件
          offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
          limit: pageSize, // 每页限制返回的数据条数
          order: [['create_timestamp', 'desc']]
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

        let subscribeArticleTagCount = await models.rss_article_tag.count({
          where: { article_tag_id: oneArticleTag.article_tag_id }
        })

        /* 所有文章专题 */
        let articleTagAll = await models.article_tag.findAll({
          attributes: [
            'article_tag_id',
            'article_tag_name',
            'article_tag_en_name'
          ]
        })

        await resClientJson(ctx, {
          state: 'success',
          message: 'user',
          data: {
            page,
            count,
            pageSize,
            article_tag_en_name: qyData.article_tag_en_name,
            subscribe_count: subscribeArticleTagCount,
            article_tag: oneArticleTag,
            tag_all: articleTagAll,
            article_list: rows
          }
        })
      } else {
        throw new ErrorMessage('当前文章标签不存在')
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
   * 获取热门文章标签
   * @param   {object} ctx 上下文对象
   */
  static async getPopularArticleTag (ctx) {
    try {
      let articleTagAll = await models.article_tag.findAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description'
        ],
        where: { enable: true },
        limit: 20, // 为空，获取全部，也可以自己添加条件
        order: [
          ['attention_count', 'DESC'] // ASC
        ]
      })

      for (let i in articleTagAll) {
        articleTagAll[i].setDataValue(
          'subscribe_count',
          await models.rss_article_tag.count({
            where: { article_tag_id: articleTagAll[i].article_tag_id }
          })
        )
        articleTagAll[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${articleTagAll[i].article_tag_id}%`
              }
            }
          })
        )
      }

      resClientJson(ctx, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: articleTagAll
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
   * 获取所有文章标签get
   * @param   {object} ctx 上下文对象
   */
  static async getArticleTagAll (ctx) {
    try {
      let articleTagAll = await models.article_tag.findAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description'
        ],
        where: { enable: true } // 为空，获取全部，也可以自己添加条件
      })

      for (let i in articleTagAll) {
        articleTagAll[i].setDataValue(
          'subscribe_count',
          await models.rss_article_tag.count({
            where: { article_tag_id: articleTagAll[i].article_tag_id }
          })
        )
        articleTagAll[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${articleTagAll[i].article_tag_id}%`
              }
            }
          })
        )
      }

      resClientJson(ctx, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: articleTagAll
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
   * ajax 查询一篇文章
   * @param   {object} ctx 上下文对象
   */
  static async getArticle (ctx) {
    let { aid } = ctx.query
    try {
      let article = await models.article.findOne({
        where: { aid, ...clientWhere.article.otherView }
      })

      if (article) {
        await models.article.update(
          { read_count: Number(article.read_count) + 1 },
          { where: { aid } } // 为空，获取全部，也可以自己添加条件
        )

        article.setDataValue(
          'create_dt',
          await TimeDistance(article.create_date)
        )

        article.setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: article.uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        if (article) {
          resClientJson(ctx, {
            state: 'success',
            message: '获取文章成功',
            data: { article }
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '获取文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取文章失败')
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
   * ajax 获取用户自己的一篇文章
   * @param   {object} ctx 上下文对象
   */
  static async getUserArticle (ctx) {
    let { aid } = ctx.query
    let { user = '' } = ctx.request
    try {
      let article = await models.article.findOne({
        where: { aid, uid: user.uid }
      })

      if (article) {
        article.setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: article.uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        article.setDataValue(
          'create_dt',
          await TimeDistance(article.create_date)
        )

        if (article) {
          resClientJson(ctx, {
            state: 'success',
            message: '获取当前用户文章成功',
            data: { article }
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '获取当前用户文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取当前用户文章失败')
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
   * 更新文章
   * @param   {object} ctx 上下文对象
   */
  static async updateArticle (ctx) {
    let reqData = ctx.request.body

    let { user = '' } = ctx.request
    try {
      let oneArticle = await models.article.findOne({
        where: {
          aid: reqData.aid,
          uid: user.uid // 查询条件
        }
      })

      if (!oneArticle) {
        throw new ErrorMessage('非法操作')
      }

      if (!reqData.title) {
        throw new ErrorMessage('请输入文章标题')
      }

      if (reqData.title.length > 150) {
        throw new ErrorMessage('文章标题过长，请小于150个字符')
      }

      if (!reqData.content) {
        throw new ErrorMessage('请输入文章内容')
      }

      if (!reqData.blog_ids) {
        throw new ErrorMessage('请选择个人专题')
      }

      if (reqData.source.length === 0 || reqData.source === null) {
        throw new ErrorMessage('请选择文章来源类型')
      }

      if (!reqData.article_tag_ids) {
        throw new ErrorMessage('请选择文章标签')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用修改文章，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
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
      if (
        ~reqData.article_tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)
      ) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.article_tag_name}只有${website.website_name}管理团队才能更新文章`
          )
        }
      }

      const result = reqData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)

      let $ = cheerio.load(reqData.content)

      let userRoleAll = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })
      let userAuthorityIds = ''
      userRoleAll.map(roleItem => {
        userAuthorityIds += roleItem.user_authority_ids + ','
      })

      let status = ~userAuthorityIds.indexOf(
        config.USER_AUTHORITY.dfNoReviewArticleId
      )
        ? 6
        : 1

      await models.article.update(
        {
          uid: user.uid,
          title: reqData.title,
          excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
          content: reqData.content /* 主内容 */,
          origin_content: reqData.origin_content /* 源内容 */,
          source: reqData.source, // 来源 （1原创 2转载）
          cover_img: result ? result[2] : '',
          status, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败;4:回收站;5:已删除;6:无需审核)'
          type: reqData.type, // 类型 （1文章 2说说 3视频 4公告 ）
          blog_ids: reqData.blog_ids,
          article_tag_ids: reqData.article_tag_ids,
          update_date: moment(date.setHours(date.getHours())).format(
            'YYYY-MM-DD HH:mm:ss'
          ) /* 时间 */,
          update_date_timestamp: moment(date.setHours(date.getHours())).format(
            'X'
          ) /* 时间戳 */
        },
        {
          where: {
            aid: reqData.aid,
            uid: user.uid // 查询条件
          }
        }
      )
      resClientJson(ctx, {
        state: 'success',
        message: '文章更新成功'
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
   * 删除文章
   * @param   {object} ctx 上下文对象
   * 删除文章判断是否有文章
   * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
   * 前台用户删除文章并不是真的删除，只是置为了删除态
   */
  static async deleteArticle (ctx) {
    const { aid } = ctx.query
    let { islogin = '', user = '' } = ctx.request

    try {
      let oneArticle = await models.article.findOne({
        where: {
          aid,
          uid: user.uid // 查询条件
        }
      })

      if (!oneArticle) {
        throw new ErrorMessage('文章不存在')
      }

      if (!islogin) {
        throw new ErrorMessage('请登录后尝试')
      }

      if (user.uid !== oneArticle.uid) {
        throw new ErrorMessage('非法操作已禁止')
      }

      await models.article.update(
        {
          status: 5
        }, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除)'}, {
        {
          where: {
            aid,
            uid: user.uid // 查询条件
          }
        }
      )
      resClientJson(ctx, {
        state: 'success',
        message: '删除文章成功'
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
   * 搜索
   * @param   {object} ctx 上下文对象
   */
  static async searchArticle (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let search = ctx.query.search
    try {
      let { count, rows } = await models.article.findAndCountAll({
        where: {
          title: { [Op.like]: `%${search}%` },
          ...clientWhere.article.otherList // web 表示前台  公共文章限制文件
        }, // 为空，获取全部，也可以自己添加条件 // status: 2 限制只有 审核通过的显示
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
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

      /* 所有文章专题 */
      let allArticleTag = await models.article_tag.findAll({
        attributes: ['article_tag_id', 'article_tag_name']
      })

      await resClientJson(ctx, {
        state: 'success',
        message: 'search',
        data: {
          page,
          count,
          pageSize,
          search,
          tag_all: allArticleTag,
          article_list: rows
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
   * 获取文章专栏
   * @param   {object} ctx 上下文对象
   */

  static async getArticleColumn (ctx) {
    try {
      let allArticleColumn = await models.article_column.findAll({
        attributes: [
          'article_column_id',
          'article_column_name',
          'article_column_en_name',
          'article_column_icon',
          'article_tag_ids',
          'article_column_description'
        ],
        where: {
          enable: true,
          is_home: true
        }, // 为空，获取全部，也可以自己添加条件
        order: [
          ['sort', 'ASC'] // asc
        ]
      })

      for (let i in allArticleColumn) {
        if (allArticleColumn[i].article_tag_ids) {
          allArticleColumn[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                article_tag_id: {
                  [Op.or]: allArticleColumn[i].article_tag_ids.split(',')
                }
              }
            })
          )
        }
      }

      resClientJson(ctx, {
        state: 'success',
        message: '获取所有文章专栏成功',
        data: {
          list: allArticleColumn
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
   * 获取文章专栏分页列表
   * @param   {object} ctx 上下文对象
   */

  static async getArticleColumnList (ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let whereParams = {
      enable: 1
    }
    try {
      let { count, rows } = await models.article_column.findAndCountAll({
        attributes: [
          'article_column_id',
          'article_column_name',
          'article_column_en_name',
          'article_column_icon',
          'article_tag_ids',
          'article_column_description'
        ],
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize // 每页限制返回的数据条数
      })

      for (let i in rows) {
        let article_tag_id =
          rows[i].article_tag_ids.length === 1
            ? rows[i].article_tag_ids
            : { [Op.in]: rows[i].article_tag_ids.split(',') }
        rows[i].setDataValue(
          'tag',
          await models.article_tag.findAll({
            where: { article_tag_id }
          })
        )
      }

      await resClientJson(ctx, {
        state: 'success',
        message: 'column',
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

module.exports = Article
