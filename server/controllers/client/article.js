const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, home_resJson } = require('../../utils/res_data')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const cheerio = require('cheerio')
const web_where = require('../../utils/web_where')

function err_mess (message) {
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
  constructor () {}

  /**
   * 文章页面render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_article (ctx) {
    let aid = ctx.params.aid

    let sql_article = await models.article
      .findOne({
        where: {
          aid: aid
        }
      })
      .then(res => {
        res.create_at = moment(res.create_date)
          .format('YYYY-MM-DD')
        return res
      })

    let findone_user = await models.user.findOne({
      where: {
        uid: sql_article.uid
      }
    })

    await models.article.update(
      {
        read_count: Number(sql_article.read_count) + 1
      },
      {
        where: { aid } // 为空，获取全部，也可以自己添加条件
      }
    )

    await render(ctx, {
      title: 'article',
      view_url: 'default/article',
      state: 'success',
      message: 'article',
      data: {
        article: sql_article,
        user: findone_user
      }
    })
  }

  /**
   * 新建文章页面render
   * @param   {obejct} ctx 上下文对象
   */
  static async render_writer (ctx) {
    await render(ctx, {
      title: 'writer',
      view_url: 'default/writer',
      state: 'success',
      message: 'writer'
    })
  }

  /**
   * 新建文章post提交
   * @param   {obejct} ctx 上下文对象
   */
  static async post_create_writer (ctx) {
    let formData = ctx.request.body
    let { islogin = '', user = '' } = ctx.request
    try {
      if (!formData.title) {
        throw new err_mess('请输入文章标题')
      }

      if (formData.title.length > 50) {
        throw new err_mess('文章标题过长，请小于50个字符')
      }

      if (!formData.content) {
        throw new err_mess('请输入文章内容')
      }

      if (!formData.topic_ids) {
        throw new err_mess('请选择个人专题')
      }

      if (formData.source.length === 0 || formData.source === null) {
        throw new err_mess('请选择文章来源类型')
      }

      if (!formData.tag_ids) {
        throw new err_mess('请选择文章标签')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    const result = formData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)

    let $ = cheerio.load(formData.content)

    try {
      await models.article
        .create({
          uid: user.uid,
          author: '',
          title: formData.title,
          excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
          content: formData.content /* 主内容 */,
          origin_content: formData.origin_content /* 源内容 */,
          source: formData.source, // 来源 （1原创 2转载）
          cover_img: result ? result[2] : '',
          status: 1, // '状态(0:草稿;1:审核中;2:审核通过;3:回收站)'
          type: formData.type, // 类型 （1文章 2说说 3视频 4公告 ）
          topic_ids: formData.topic_ids,
          tag_ids: formData.tag_ids
        })
        .then(function (data) {
          home_resJson(ctx, {
            state: 'success',
            message: '文章创建成功'
          })
        })
        .catch(function (err) {
          home_resJson(ctx, {
            state: 'error',
            message: err
          })
        })
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
    }
  }

  /**
   * 文章的标签页面
   * @param   {obejct} ctx 上下文对象
   */

  static async render_get_tag (ctx) {
    let article_tag_id = ctx.params.article_tag_id

    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let find_article_tag = await models.article_tag.findOne({
      where: {
        article_tag_id: article_tag_id
      }
    })
    if (find_article_tag) {
      let { count, rows } = await models.article
        .findAndCountAll({
          where: {
            article_tag_ids: { [Op.like]: `%${article_tag_id}%` },
            ...web_where.article // web 表示前台  公共文章限制文件
          }, // 为空，获取全部，也可以自己添加条件
          offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
          limit: pageSize, // 每页限制返回的数据条数
          order: [['create_date_timestamp', 'desc']]
        })

      for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
        rows[item].create_at = await moment(rows[item].create_date)
          .format('YYYY-MM-DD H:m:s')
        rows[item].user = await models.user.findOne({
          where: { uid: rows[item].uid },
          attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
        })
      }

      let subscribe_count = await models.subscribe_article_tag.count({
        where: { article_tag_id }
      })

      /* 所有文章专题 */
      let article_tag_all = await models.article_tag.findAll({
        attributes: ['article_tag_id', 'article_tag_name']
      })

      await render(ctx, {
        title: 'tag',
        view_url: 'default/tag',
        state: 'success',
        message: 'user',
        data: {
          page,
          count,
          pageSize,
          article_tag_id,
          subscribe_count,
          article_tag: find_article_tag,
          tag_all: article_tag_all,
          article_list: rows
        }
      })
    } else {
      ctx.redirect('/404')
    }
  }

  /**
   * 获取所有文章标签get
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article_tag_all (ctx) {
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name'],
      where: { enable: true } // 为空，获取全部，也可以自己添加条件
    })
    home_resJson(ctx, {
      state: 'success',
      message: '获取所有文章标签成功',
      data: {
        list: article_tag_all
      }
    })
  }

  /**
   * ajax 查询一篇文章
   * @param   {obejct} ctx 上下文对象
   */
  static async get_article (ctx) {
    let aid = ctx.query.aid

    let article = await models.article.findOne({
      where: { aid }
    })

    if (article) {
      home_resJson(ctx, {
        state: 'success',
        message: '获取文章成功',
        data: {
          article
        }
      })
    } else {
      home_resJson(ctx, {
        state: 'error',
        message: '获取文章失败'
      })
    }
  }

  /**
   * 搜索
   * @param   {obejct} ctx 上下文对象
   */
  static async form_search_article (ctx) {
    const title = 'search'
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25
    let search = ctx.query.search

    let { count, rows } = await models.article
      .findAndCountAll({
        where: {
          title: { [Op.like]: `%${search}%` },
          ...web_where.article // web 表示前台  公共文章限制文件
        }, // 为空，获取全部，也可以自己添加条件 // status: 2 限制只有 审核通过的显示
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_date_timestamp', 'desc']]
      })

    for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_at = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
    }

    /* 所有文章专题 */
    let article_tag_all = await models.article_tag.findAll({
      attributes: ['article_tag_id', 'article_tag_name']
    })

    await render(ctx, {
      title: title,
      view_url: 'default/search',
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
  }

  /**
   * 获取文章专栏
   * @param   {obejct} ctx 上下文对象
   */

  static async get_article_column (ctx) {
    let article_tag_all = await models.article_column.findAll({
      attributes: [
        'article_column_id',
        'article_column_name',
        'article_column_us_name',
        'article_column_icon',
        'article_column_subscribe',
        'article_column_icon_type',
        'article_column_tags',
        'article_column_description'
      ],
      where: { enable: true } // 为空，获取全部，也可以自己添加条件
    })
    home_resJson(ctx, {
      state: 'success',
      message: '获取所有文章专栏成功',
      data: {
        list: article_tag_all
      }
    })
  }
}

module.exports = Article
