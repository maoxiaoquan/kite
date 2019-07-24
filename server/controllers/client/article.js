const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { client_resJson } = require('../../utils/res_data')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const cheerio = require('cheerio')
const client_where = require('../../utils/client_where')
const Seq = require('sequelize')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')

function ErrorMessage(message) {
  this.message = message
  this.name = 'UserException'
}

function getNoMarkupStr(markupStr) {
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

function getSubStr(string) {
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
  static async post_create_writer(ctx) {
    let formData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (!formData.title) {
        throw new ErrorMessage('请输入文章标题')
      }

      if (formData.title.length > 150) {
        throw new ErrorMessage('文章标题过长，请小于150个字符')
      }

      if (!formData.content) {
        throw new ErrorMessage('请输入文章内容')
      }

      if (!formData.user_topic_ids) {
        throw new ErrorMessage('请选择个人专题')
      }

      if (formData.source.length === 0 || formData.source === null) {
        throw new ErrorMessage('请选择文章来源类型')
      }

      if (!formData.article_tag_ids) {
        throw new ErrorMessage('请选择文章标签')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (
        new Date(currDate).getTime() < new Date(user.article_ban_dt).getTime()
      ) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布文章，时间到：${moment(
            user.article_ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      let findOneArticleTag = await models.article_tag.findOne({
        where: {
          article_tag_id: config.ARTICLE_TAG.official_exclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (
        ~formData.article_tag_ids.indexOf(config.ARTICLE_TAG.official_exclusive)
      ) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.management_team)) {
          throw new ErrorMessage(
            `${findOneArticleTag.article_tag_name}只有${
            website.website_name
            }管理团队才能发布文章`
          )
        }
      }

      const result = formData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)
      let $ = cheerio.load(formData.content)

      let find_role_all = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })

      let user_authority_ids = ''
      find_role_all.map(roleItem => {
        user_authority_ids += roleItem.user_authority_ids + ','
      })

      let status = ~user_authority_ids.indexOf(
        config.USER_AUTHORITY.article_review_authority_id
      )
        ? 6
        : 1

      await models.article.create({
        uid: user.uid,
        title: xss(formData.title),
        excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
        content: xss(formData.content) /* 主内容 */,
        origin_content: formData.origin_content /* 源内容 */,
        source: formData.source, // 来源 （1原创 2转载）
        cover_img: result ? result[2] : '',
        status, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败;4:回收站;5:已删除;6:无需审核)'
        type: formData.type, // 类型 （1文章 2说说 3视频 4公告 ）
        user_topic_ids: formData.user_topic_ids,
        article_tag_ids: formData.article_tag_ids
      })

      client_resJson(ctx, {
        state: 'success',
        message: '文章创建成功'
      })
    } catch (err) {
      client_resJson(ctx, {
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

  static async get_article_tag(ctx) {
    let article_tag_en_name = ctx.query.article_tag_en_name

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    try {
      let find_article_tag = await models.article_tag.findOne({
        where: {
          article_tag_en_name: article_tag_en_name
        }
      })
      if (find_article_tag) {
        let { count, rows } = await models.article.findAndCountAll({
          where: {
            article_tag_ids: {
              [Op.like]: `%${find_article_tag.article_tag_id}%`
            },
            ...client_where.article.otherList // web 表示前台  公共文章限制文件
          }, // 为空，获取全部，也可以自己添加条件
          offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
          limit: pageSize, // 每页限制返回的数据条数
          order: [['create_timestamp', 'desc']]
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

        let subscribe_count = await models.subscribe_article_tag.count({
          where: { article_tag_id: find_article_tag.article_tag_id }
        })

        /* 所有文章专题 */
        let article_tag_all = await models.article_tag.findAll({
          attributes: [
            'article_tag_id',
            'article_tag_name',
            'article_tag_en_name'
          ]
        })

        await client_resJson(ctx, {
          state: 'success',
          message: 'user',
          data: {
            page,
            count,
            pageSize,
            article_tag_en_name,
            subscribe_count,
            article_tag: find_article_tag,
            tag_all: article_tag_all,
            article_list: rows
          }
        })
      } else {
        throw new ErrorMessage('当前文章标签不存在')
      }
    } catch (err) {
      client_resJson(ctx, {
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
  static async get_popular_article_tag(ctx) {
    try {
      let article_tag_all = await models.article_tag.findAll({
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

      for (let i in article_tag_all) {
        article_tag_all[i].setDataValue(
          'subscribe_count',
          await models.subscribe_article_tag.count({
            where: { article_tag_id: article_tag_all[i].article_tag_id }
          })
        )
        article_tag_all[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${article_tag_all[i].article_tag_id}%`
              }
            }
          })
        )
      }

      client_resJson(ctx, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: article_tag_all
        }
      })
    } catch (err) {
      client_resJson(ctx, {
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
      let article_tag_all = await models.article_tag.findAll({
        attributes: [
          'article_tag_id',
          'article_tag_name',
          'article_tag_en_name',
          'article_tag_icon',
          'article_tag_description'
        ],
        where: { enable: true } // 为空，获取全部，也可以自己添加条件
      })

      for (let i in article_tag_all) {
        article_tag_all[i].setDataValue(
          'subscribe_count',
          await models.subscribe_article_tag.count({
            where: { article_tag_id: article_tag_all[i].article_tag_id }
          })
        )
        article_tag_all[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              article_tag_ids: {
                [Op.like]: `%${article_tag_all[i].article_tag_id}%`
              }
            }
          })
        )
      }

      client_resJson(ctx, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: article_tag_all
        }
      })
    } catch (err) {
      client_resJson(ctx, {
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
  static async get_article(ctx) {
    let aid = ctx.query.aid
    try {
      let article = await models.article.findOne({
        where: { aid, ...client_where.article.otherView }
      })

      if (article) {
        await models.article.update(
          { read_count: Number(article.read_count) + 1 },
          { where: { aid } } // 为空，获取全部，也可以自己添加条件
        )

        article.setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: article.uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        if (article) {
          client_resJson(ctx, {
            state: 'success',
            message: '获取文章成功',
            data: { article }
          })
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '获取文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取文章失败')
      }
    } catch (err) {
      client_resJson(ctx, {
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
  static async getUserArticle(ctx) {
    let aid = ctx.query.aid
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

        if (article) {
          client_resJson(ctx, {
            state: 'success',
            message: '获取当前用户文章成功',
            data: { article }
          })
        } else {
          client_resJson(ctx, {
            state: 'error',
            message: '获取当前用户文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取当前用户文章失败')
      }
    } catch (err) {
      client_resJson(ctx, {
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
  static async update_article(ctx) {
    let formData = ctx.request.body

    let { user = '' } = ctx.request
    try {
      let FindOneArticle = await models.article.findOne({
        where: {
          aid: formData.aid,
          uid: user.uid // 查询条件
        }
      })

      if (!FindOneArticle) {
        throw new ErrorMessage('非法操作')
      }

      if (!formData.title) {
        throw new ErrorMessage('请输入文章标题')
      }

      if (formData.title.length > 150) {
        throw new ErrorMessage('文章标题过长，请小于150个字符')
      }

      if (!formData.content) {
        throw new ErrorMessage('请输入文章内容')
      }

      if (!formData.user_topic_ids) {
        throw new ErrorMessage('请选择个人专题')
      }

      if (formData.source.length === 0 || formData.source === null) {
        throw new ErrorMessage('请选择文章来源类型')
      }

      if (!formData.article_tag_ids) {
        throw new ErrorMessage('请选择文章标签')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (
        new Date(currDate).getTime() < new Date(user.article_ban_dt).getTime()
      ) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用修改文章，时间到：${moment(
            user.article_ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      let findOneArticleTag = await models.article_tag.findOne({
        where: {
          article_tag_id: config.ARTICLE_TAG.official_exclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (
        ~formData.article_tag_ids.indexOf(config.ARTICLE_TAG.official_exclusive)
      ) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.management_team)) {
          throw new ErrorMessage(
            `${findOneArticleTag.article_tag_name}只有${
            website.website_name
            }管理团队才能更新文章`
          )
        }
      }

      const result = formData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)

      let $ = cheerio.load(formData.content)

      let find_role_all = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })
      let user_authority_ids = ''
      find_role_all.map(roleItem => {
        user_authority_ids += roleItem.user_authority_ids + ','
      })

      let status = ~user_authority_ids.indexOf(
        config.USER_AUTHORITY.article_review_authority_id
      )
        ? 6
        : 1

      await models.article.update(
        {
          uid: user.uid,
          title: formData.title,
          excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
          content: formData.content /* 主内容 */,
          origin_content: formData.origin_content /* 源内容 */,
          source: formData.source, // 来源 （1原创 2转载）
          cover_img: result ? result[2] : '',
          status, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败;4:回收站;5:已删除;6:无需审核)'
          type: formData.type, // 类型 （1文章 2说说 3视频 4公告 ）
          user_topic_ids: formData.user_topic_ids,
          article_tag_ids: formData.article_tag_ids,
          update_date: moment(date.setHours(date.getHours())).format(
            'YYYY-MM-DD HH:mm:ss'
          ) /* 时间 */,
          update_date_timestamp: moment(date.setHours(date.getHours())).format(
            'X'
          ) /* 时间戳 */
        },
        {
          where: {
            aid: formData.aid,
            uid: user.uid // 查询条件
          }
        }
      )
      client_resJson(ctx, {
        state: 'success',
        message: '文章更新成功'
      })
    } catch (err) {
      client_resJson(ctx, {
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
      let find_article = await models.article.findOne({
        where: {
          aid,
          uid: user.uid // 查询条件
        }
      })

      if (!find_article) {
        throw new ErrorMessage('文章不存在')
      }

      if (!islogin) {
        throw new ErrorMessage('请登录后尝试')
      }

      if (user.uid !== find_article.uid) {
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
      client_resJson(ctx, {
        state: 'success',
        message: '删除文章成功'
      })
    } catch (err) {
      client_resJson(ctx, {
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
  static async search_article(ctx) {
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let search = ctx.query.search
    try {
      let { count, rows } = await models.article.findAndCountAll({
        where: {
          title: { [Op.like]: `%${search}%` },
          ...client_where.article.otherList // web 表示前台  公共文章限制文件
        }, // 为空，获取全部，也可以自己添加条件 // status: 2 限制只有 审核通过的显示
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
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

      /* 所有文章专题 */
      let article_tag_all = await models.article_tag.findAll({
        attributes: ['article_tag_id', 'article_tag_name']
      })

      await client_resJson(ctx, {
        state: 'success',
        message: 'search',
        data: {
          page,
          count,
          pageSize,
          search,
          tag_all: article_tag_all,
          article_list: rows
        }
      })
    } catch (err) {
      client_resJson(ctx, {
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

  static async get_article_column(ctx) {
    try {
      let article_tag_all = await models.article_column.findAll({
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
      client_resJson(ctx, {
        state: 'success',
        message: '获取所有文章专栏成功',
        data: {
          list: article_tag_all
        }
      })
    } catch (err) {
      client_resJson(ctx, {
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

    let where_params = {
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
        where: where_params, // 为空，获取全部，也可以自己添加条件
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

      await client_resJson(ctx, {
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
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Article
