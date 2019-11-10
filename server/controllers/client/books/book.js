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
  userMessageType,
  userMessageAction,
  virtualAction,
  virtualType,
  productType,
  trialRead
} = require('../../../utils/constant')

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

class Book {
  /**
   * 新建小书post提交
   * @param   {object} ctx 上下文对象
   */
  static async createBook (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (!reqData.title) {
        throw new ErrorMessage('请输入小书名字')
      }

      if (reqData.title.length > 150) {
        throw new ErrorMessage('小书标题过长，请小于150个字符')
      }

      if (!reqData.content) {
        throw new ErrorMessage('请输入小书详情')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布系统，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      // 虚拟币判断是否可以进行继续的操作
      const isVirtual = await userVirtual.isVirtual({
        uid: user.uid,
        type: virtualType.book,
        action: virtualAction.create
      })

      if (!isVirtual) {
        throw new ErrorMessage('贝壳余额不足！')
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

      let status = ~userAuthorityIds.indexOf(config.BOOK.dfNoReviewBookId)
        ? freeReview // 免审核
        : pendingReview // 待审核

      let bookCreate = await models.book.create({
        uid: user.uid,
        books_id: reqData.books_id,
        title: xss(reqData.title),
        content: xss(reqData.content) /* 主内容 */,
        excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
        origin_content: reqData.origin_content /* 源内容 */,
        status, // '1:审核中;2:审核通过;3:审核失败;4：无需审核'
        sort: reqData.sort,
        trial_read: reqData.trial_read,
        read_time: reqData.content.length
      })

      await userVirtual.setVirtual({
        uid: user.uid,
        associate: JSON.stringify({
          book_id: bookCreate.book_id
        }),
        type: virtualType.book,
        action: virtualAction.create
      })

      resClientJson(ctx, {
        state: 'success',
        message: '创建成功',
        data: {
          book: bookCreate
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
   * ajax 查询一篇用户自己的小书章节
   * @param   {object} ctx 上下文对象
   */
  static async getUserBookInfo (ctx) {
    let { book_id } = ctx.query
    let { user = '' } = ctx.request
    try {
      let oneBook = await models.book.findOne({
        where: {
          uid: user.uid,
          book_id
        }
      })

      if (oneBook) {
        if (oneBook) {
          resClientJson(ctx, {
            state: 'success',
            message: '获取小书成功',
            data: { book: oneBook }
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '获取小书失败'
          })
        }
      } else {
        throw new ErrorMessage('获取小书失败')
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
   * ajax 查询一篇用户可查看的小书章节
   * @param   {object} ctx 上下文对象
   */
  static async getBookInfo (ctx) {
    let { book_id } = ctx.query
    let { user = '', islogin } = ctx.request
    try {
      let oneBook = await models.book.findOne({
        where: {
          book_id
        }
      })

      if (oneBook) {
        if (islogin) {
          // 获取商品信息
          const productInfo = await models.order.findOne({
            where: {
              product_id: oneBook.books_id,
              product_type: productType.books,
              uid: user.uid
            }
          })
          if (productInfo || user.uid === oneBook.uid) {
            // 当前商品已被购买，或者小书是自己发布的，即可直接阅读
            // 存在商品信息，说明当前商品已被用户购买
            oneBook.setDataValue('isLook', true)
          } else {
            oneBook.setDataValue('isLook', false)
          }
          if (
            oneBook.trial_read !== trialRead.yes &&
            !productInfo &&
            user.uid !== oneBook.uid
          ) {
            oneBook.setDataValue('content', '需要购买方可继续阅读')
            oneBook.setDataValue('origin_content', '需要购买方可继续阅读')
          }
        } else {
          oneBook.setDataValue('isLook', false)
          if (oneBook.trial_read !== trialRead.yes) {
            oneBook.setDataValue('content', '需要购买方可继续阅读')
            oneBook.setDataValue('origin_content', '需要购买方可继续阅读')
          }
        }

        await models.book.update(
          { read_count: Number(oneBook.read_count) + 1 },
          { where: { book_id } } // 为空，获取全部，也可以自己添加条件
        )

        if (oneBook) {
          resClientJson(ctx, {
            state: 'success',
            message: '获取小书成功',
            data: { book: oneBook }
          })
        } else {
          resClientJson(ctx, {
            state: 'error',
            message: '获取小书失败'
          })
        }
      } else {
        throw new ErrorMessage('获取小书失败')
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
   * 更新小书
   * @param   {object} ctx 上下文对象
   */
  static async updateBook (ctx) {
    let reqData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      if (!reqData.title) {
        throw new ErrorMessage('请输入小书名字')
      }

      if (reqData.title.length > 150) {
        throw new ErrorMessage('小书标题过长，请小于150个字符')
      }

      if (!reqData.content) {
        throw new ErrorMessage('请输入小书详情')
      }

      const result = reqData.origin_content.match(/!\[(.*?)\]\((.*?)\)/)
      let $ = cheerio.load(reqData.content)

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布系统，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
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

      let status = ~userAuthorityIds.indexOf(config.BOOK.dfNoReviewBookId)
        ? freeReview // 免审核
        : pendingReview // 待审核

      await models.book.update(
        {
          uid: user.uid,
          title: xss(reqData.title),
          content: xss(reqData.content) /* 主内容 */,
          excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
          origin_content: reqData.origin_content /* 源内容 */,
          status, // '1:审核中;2:审核通过;3:审核失败;4：无需审核'
          sort: reqData.sort,
          trial_read: reqData.trial_read,
          read_time: reqData.content.length
        },
        {
          where: {
            book_id: reqData.book_id, // 查询条件
            uid: user.uid
          }
        }
      )

      resClientJson(ctx, {
        state: 'success',
        message: '修改小书成功'
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
   * 删除一本小书
   * @param   {object} ctx 上下文对象
   */

  static async deleteBook (ctx) {
    const resData = ctx.request.body
    let { user = '' } = ctx.request
    try {
      await models.book.destroy({
        where: {
          book_id: resData.book_id, // 查询条件
          uid: user.uid
        }
      })
      resClientJson(ctx, {
        state: 'success',
        message: '删除小书章节成功'
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
   * 获取小书的上一页下一页
   * @param   {object} ctx 上下文对象
   */
  static async getNextPrevBook (ctx) {
    const resData = ctx.request.body
    try {
      let prev = await models.book.findOne({
        where: {
          books_id: resData.books_id,
          book_id: {
            [Op.lt]: resData.book_id
          } // 查询条件
        },
        limit: 1,
        order: [['book_id', 'DESC']]
      })

      let next = await models.book.findOne({
        where: {
          books_id: resData.books_id,
          book_id: {
            [Op.gt]: resData.book_id
          } // 查询条件
        },
        limit: 1,
        order: [['book_id', 'ASC']]
      })

      resClientJson(ctx, {
        state: 'success',
        message: '获取上一页，下一页成功',
        data: {
          prev,
          next
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

module.exports = Book
