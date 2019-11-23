const models = require('../../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../../utils/clientWhere')
const xss = require('xss')
const config = require('../../../config')
const { lowdb } = require('../../../../db/lowdb/index')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  modelType,
  userMessageAction,
  virtualAction,
  virtualType
} = require('../../../utils/constant')
const { TimeNow, TimeDistance } = require('../../../utils/time')

const userVirtual = require('../../../common/userVirtual')

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
  static async createArticle (req, res, next) {
    let reqData = req.body
    let { user = '' } = req
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

      if (!reqData.tag_ids) {
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

      // 虚拟币判断是否可以进行继续的操作
      const isVirtual = await userVirtual.isVirtual({
        uid: user.uid,
        type: virtualType.article,
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
      if (~reqData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.name}只有${website.website_name}管理团队才能发布文章`
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
        ? freeReview // 免审核
        : pendingReview // 待审核

      let createArticle = await models.article.create({
        uid: user.uid,
        title: xss(reqData.title),
        excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
        content: xss(reqData.content) /* 主内容 */,
        origin_content: reqData.origin_content /* 源内容 */,
        source: reqData.source, // 来源 （1原创 2转载）
        cover_img: result ? result[2] : '',
        status, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败;4:回收站;5:已删除;6:无需审核)'
        is_public: Number(reqData.is_public), // 是否公开
        type: reqData.type, // 类型 （1文章 2日记 3草稿 ）
        blog_ids: reqData.blog_ids,
        tag_ids: reqData.tag_ids
      })

      await userVirtual.setVirtual({
        uid: user.uid,
        associate: JSON.stringify({
          aid: createArticle.aid
        }),
        type: virtualType.article,
        action: virtualAction.create
      })

      resClientJson(res, {
        state: 'success',
        message:
          '文章创建成功，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布'
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
   * 文章的标签页面
   * @param   {object} ctx 上下文对象
   */

  static async getArticleTag (req, res, next) {
    let qyData = req.params

    let page = req.params.page || 1
    let pageSize = req.params.pageSize || 25

    try {
      let oneArticleTag = await models.article_tag.findOne({
        where: {
          en_name: qyData.en_name
        }
      })
      if (oneArticleTag) {
        let { count, rows } = await models.article.findAndCountAll({
          where: {
            tag_ids: {
              [Op.like]: `%${oneArticleTag.tag_id}%`
            },
            type: {
              [Op.or]: [articleType.article, articleType.note] // 文章和笔记
            },
            is_public: true, // 公开的文章
            status: {
              [Op.or]: [reviewSuccess, freeReview] // 审核成功、免审核
            } // web 表示前台  公共文章限制文件
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

          let oneArticleBlog = await models.article_blog.findOne({
            where: { blog_id: rows[i].blog_ids }
          })

          if (
            oneArticleBlog &&
            ~[reviewSuccess, freeReview].indexOf(oneArticleBlog.status)
          ) {
            rows[i].setDataValue('article_blog', oneArticleBlog)
          }

          if (rows[i].tag_ids) {
            rows[i].setDataValue(
              'tag',
              await models.article_tag.findAll({
                where: {
                  tag_id: {
                    [Op.or]: rows[i].tag_ids.split(',')
                  }
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

        let subscribeArticleTagCount = await models.attention.count({
          where: {
            associate_id: oneArticleTag.tag_id,
            is_associate: true,
            type: modelType.article_tag
          }
        })

        /* 所有文章专题 */
        let articleTagAll = await models.article_tag.findAll({
          attributes: ['tag_id', 'name', 'en_name']
        })

        await resClientJson(res, {
          state: 'success',
          message: 'user',
          data: {
            page,
            count,
            pageSize,
            en_name: qyData.en_name,
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
      resClientJson(res, {
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
  static async getPopularArticleTag (req, res, next) {
    try {
      let articleTagAll = await models.article_tag.findAll({
        attributes: ['tag_id', 'name', 'en_name', 'icon', 'description'],
        where: { enable: true },
        limit: 20, // 为空，获取全部，也可以自己添加条件
        order: [
          ['attention_count', 'DESC'] // ASC
        ]
      })

      for (let i in articleTagAll) {
        articleTagAll[i].setDataValue(
          'subscribe_count',
          await models.attention.count({
            where: {
              associate_id: articleTagAll[i].id,
              is_associate: true,
              type: modelType.article_tag
            }
          })
        )
        articleTagAll[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              tag_ids: {
                [Op.like]: `%${articleTagAll[i].tag_id}%`
              }
            }
          })
        )
      }

      resClientJson(res, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: articleTagAll
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
   * 获取所有文章标签get
   * @param   {object} ctx 上下文对象
   */
  static async getArticleTagAll (req, res, next) {
    try {
      let articleTagAll = await models.article_tag.findAll({
        attributes: ['tag_id', 'name', 'en_name', 'icon', 'description'],
        where: { enable: true } // 为空，获取全部，也可以自己添加条件
      })

      for (let i in articleTagAll) {
        articleTagAll[i].setDataValue(
          'subscribe_count',
          await models.attention.count({
            where: {
              associate_id: articleTagAll[i].id || '',
              is_associate: true,
              type: modelType.article_tag
            }
          })
        )
        articleTagAll[i].setDataValue(
          'article_count',
          await models.article.count({
            where: {
              tag_ids: {
                [Op.like]: `%${articleTagAll[i].tag_id}%`
              }
            }
          })
        )
      }

      resClientJson(res, {
        state: 'success',
        message: '获取所有文章标签成功',
        data: {
          list: articleTagAll
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
   * ajax 查询一篇文章
   * @param   {object} ctx 上下文对象
   */
  static async getArticle (req, res, next) {
    let { aid } = req.params
    try {
      let oneArticle = await models.article.findOne({
        where: {
          aid,
          type: {
            [Op.or]: [articleType.article, articleType.note] // 文章和笔记
          },
          status: {
            [Op.or]: [reviewSuccess, freeReview] // 审核成功、免审核
          }
        }
      })

      if (oneArticle) {
        await models.article.update(
          { read_count: Number(oneArticle.read_count) + 1 },
          { where: { aid } } // 为空，获取全部，也可以自己添加条件
        )

        oneArticle.setDataValue(
          'create_dt',
          await TimeDistance(oneArticle.create_date)
        )

        let oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: oneArticle.blog_ids }
        })

        if (
          oneArticleBlog &&
          ~[reviewSuccess, freeReview].indexOf(oneArticleBlog.status)
        ) {
          oneArticle.setDataValue('article_blog', oneArticleBlog)
        }

        if (oneArticle.tag_ids) {
          oneArticle.setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: { [Op.or]: oneArticle.tag_ids.split(',') }
              }
            })
          )
        }

        oneArticle.setDataValue(
          'likeUserIds',
          await models.thumb.findAll({
            where: {
              associate_id: oneArticle.aid,
              is_associate: true,
              type: modelType.article
            }
          })
        )

        oneArticle.setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: oneArticle.uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )

        if (oneArticle) {
          resClientJson(res, {
            state: 'success',
            message: '获取文章成功',
            data: { article: oneArticle }
          })
        } else {
          resClientJson(res, {
            state: 'error',
            message: '获取文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取文章失败')
      }
    } catch (err) {
      resClientJson(res, {
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
  static async getUserArticle (req, res, next) {
    let { aid } = req.params
    let { user = '' } = req
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
          resClientJson(res, {
            state: 'success',
            message: '获取当前用户文章成功',
            data: { article }
          })
        } else {
          resClientJson(res, {
            state: 'error',
            message: '获取当前用户文章失败'
          })
        }
      } else {
        throw new ErrorMessage('获取当前用户文章失败')
      }
    } catch (err) {
      resClientJson(res, {
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
  static async updateArticle (req, res, next) {
    let reqData = req.body

    let { user = '' } = req
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

      if (!reqData.tag_ids) {
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
          tag_id: config.ARTICLE_TAG.dfOfficialExclusive
        }
      })
      const website = lowdb
        .read()
        .get('website')
        .value()
      if (~reqData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
          throw new ErrorMessage(
            `${oneArticleTag.name}只有${website.website_name}管理团队才能更新文章`
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
        ? freeReview
        : pendingReview

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
          is_public: Number(reqData.is_public), // 是否公开
          type: reqData.type, // 类型 （1文章 2日记 3草稿 ）
          blog_ids: reqData.blog_ids,
          tag_ids: reqData.tag_ids,
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

      resClientJson(res, {
        state: 'success',
        message:
          '文章更新后需要重新审核，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布'
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
   * 删除文章
   * @param   {object} ctx 上下文对象
   * 删除文章判断是否有文章
   * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
   * 前台用户删除文章并不是真的删除，只是置为了删除态
   */
  static async deleteArticle (req, res, next) {
    const { aid } = req.params
    let { islogin = '', user = '' } = req

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
          status: deletes
        }, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除)'}, {
        {
          where: {
            aid,
            uid: user.uid // 查询条件
          }
        }
      )
      resClientJson(res, {
        state: 'success',
        message: '删除文章成功'
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
   * 搜索
   * @param   {object} ctx 上下文对象
   */
  static async searchArticle (req, res, next) {
    let page = req.params.page || 1
    let pageSize = req.params.pageSize || 25
    let search = req.params.search
    try {
      let { count, rows } = await models.article.findAndCountAll({
        where: {
          title: { [Op.like]: `%${search}%` },
          type: {
            [Op.or]: [articleType.article, articleType.note] // 文章和笔记
          },
          is_public: true, // 公开的文章
          status: {
            [Op.or]: [reviewSuccess, freeReview] // 审核成功、免审核
          } // web 表示前台  公共文章限制文件
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

        let oneArticleBlog = await models.article_blog.findOne({
          where: { blog_id: rows[i].blog_ids }
        })

        if (
          oneArticleBlog &&
          ~[reviewSuccess, freeReview].indexOf(oneArticleBlog.status)
        ) {
          rows[i].setDataValue('article_blog', oneArticleBlog)
        }

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

      /* 所有文章专题 */
      let allArticleTag = await models.article_tag.findAll({
        attributes: ['tag_id', 'name']
      })

      await resClientJson(res, {
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
      resClientJson(res, {
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

  static async getArticleColumn (req, res, next) {
    try {
      let allArticleColumn = await models.article_column.findAll({
        attributes: [
          'column_id',
          'name',
          'en_name',
          'icon',
          'tag_ids',
          'description'
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
        if (allArticleColumn[i].tag_ids) {
          allArticleColumn[i].setDataValue(
            'tag',
            await models.article_tag.findAll({
              where: {
                tag_id: {
                  [Op.or]: allArticleColumn[i].tag_ids.split(',')
                }
              }
            })
          )
        }
      }

      resClientJson(res, {
        state: 'success',
        message: '获取所有文章专栏成功',
        data: {
          list: allArticleColumn
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
   * 获取文章专栏分页列表
   * @param   {object} ctx 上下文对象
   */

  static async getArticleColumnList (req, res, next) {
    let page = req.params.page || 1
    let pageSize = req.params.pageSize || 25

    let whereParams = {
      enable: 1
    }
    try {
      let { count, rows } = await models.article_column.findAndCountAll({
        attributes: [
          'column_id',
          'name',
          'en_name',
          'icon',
          'tag_ids',
          'description'
        ],
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize // 每页限制返回的数据条数
      })

      for (let i in rows) {
        let tag_id =
          rows[i].tag_ids.length === 1
            ? rows[i].tag_ids
            : { [Op.in]: rows[i].tag_ids.split(',') }
        rows[i].setDataValue(
          'tag',
          await models.article_tag.findAll({
            where: { tag_id }
          })
        )
      }

      await resClientJson(res, {
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
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Article
