const models = require('../../../../../db/mysqldb/index')
import moment from 'moment'
const { resClientJson } = require('../../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../../utils/clientWhere')
const config = require('../../../../../config')
const { TimeNow, TimeDistance } = require('../../../utils/time')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  userMessageAction,
  modelAction,
  virtualType,
  modelType
} = require('../../../utils/constant')

const userMessage = require('../../../utils/userMessage')
import userVirtual from '../../../common/userVirtual'

/* 评论模块 */

class BooksComment {
  static async getBooksCommentList(req: any, res: any, next: any) {
    let books_id = req.query.books_id
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10

    try {
      let { count, rows } = await models.books_comment.findAndCountAll({
        // 默认一级评论
        where: {
          books_id,
          parent_id: 0,
          status: {
            [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
          }
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [['create_date', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await TimeDistance(rows[i].create_date)
        )
        if (Number(rows[i].status) === pendingReview) {
          rows[i].setDataValue('content', '当前用户评论需要审核')
        }
        if (Number(rows[i].status) === reviewFail) {
          rows[i].setDataValue('content', '当前用户评论违规')
        }
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      for (let item in rows) {
        // 循环取子评论
        let childAllComment = await models.books_comment.findAll({
          where: {
            parent_id: rows[item].id,
            status: {
              [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
            }
          }
        })
        rows[item].setDataValue('children', childAllComment)
        for (let childCommentItem in childAllComment) {
          // 循环取用户  代码有待优化，层次过于复杂
          childAllComment[childCommentItem].setDataValue(
            'create_dt',
            await TimeDistance(childAllComment[childCommentItem].create_date)
          )
          childAllComment[childCommentItem].setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: childAllComment[childCommentItem].uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
          if (
            childAllComment[childCommentItem].reply_uid !== 0 &&
            childAllComment[childCommentItem].reply_uid !==
            childAllComment[childCommentItem].uid
          ) {
            childAllComment[childCommentItem].setDataValue(
              'reply_user',
              await models.user.findOne({
                where: { uid: childAllComment[childCommentItem].reply_uid },
                attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
              })
            )
          }
        }
      }

      await resClientJson(res, {
        state: 'success',
        message: '获取评论列表成功',
        data: {
          page,
          pageSize,
          count,
          comment_list: rows
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
   * 新建评论post提交
   * @param   {object} ctx 上下文对象
   */
  static async createBooksComment(req: any, res: any, next: any) {
    let reqData = req.body
    let { user = '' } = req

    try {
      if (!reqData.content) {
        throw new Error('请输入评论内容')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      let oneBooks = await models.books.findOne({
        where: {
          books_id: reqData.books_id
        }
      })

      if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
        throw new Error(
          `当前用户因违规已被管理员禁用发布评论，时间到：${moment(
            user.ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

      // 虚拟币判断是否可以进行继续的操作
      const isVirtual = await userVirtual.isVirtual({
        uid: user.uid,
        type: virtualType.books,
        action: modelAction.comment
      })

      if (!isVirtual) {
        throw new Error('贝壳余额不足！')
      }

      let allUserRole = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })
      let userAuthorityIds = ''
      allUserRole.map((roleItem: any) => {
        userAuthorityIds += roleItem.user_authority_ids + ','
      })
      let status = ~userAuthorityIds.indexOf(
        config.BOOKS.dfNoReviewBooksCommentId
      )
        ? freeReview // 免审核
        : pendingReview // 待审核

      await models.books_comment
        .create({
          parent_id: reqData.parent_id || 0,
          books_id: reqData.books_id,
          star: reqData.star,
          uid: user.uid,
          reply_uid: reqData.reply_uid || 0,
          content: xss(reqData.content),
          status
        })
        .then(async (data: any) => {
          await models.books.update(
            {
              // 更新小书评论数
              comment_count: await models.books_comment.count({
                where: {
                  books_id: reqData.books_id,
                  parent_id: 0
                }
              })
            },
            { where: { books_id: reqData.books_id } }
          )

          const oneUser = await models.user.findOne({
            where: { uid: user.uid }
          }) // 查询当前评论用户的信息

          let _data = {
            // 组合返回的信息
            ...data.get({
              plain: true
            }),
            children: [],
            user: oneUser
          }

          if (
            reqData.reply_uid &&
            reqData.reply_uid !== 0 &&
            reqData.reply_uid !== user.uid
          ) {
            _data.reply_user = await models.user.findOne({
              where: { uid: reqData.reply_uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          }

          _data['create_dt'] = await TimeDistance(_data.create_date)

          // 虚拟币消耗后期开启事物
          await userVirtual.setVirtual({
            uid: user.uid,
            associate: JSON.stringify({
              comment_id: _data.id,
              books_id: reqData.books_id
            }),
            type: virtualType.books,
            action: modelAction.comment,
            ass_uid: oneBooks.uid
          })

          if (oneBooks.uid !== user.uid) {
            // 屏蔽自己
            await userVirtual.setVirtual({
              uid: oneBooks.uid,
              associate: JSON.stringify({
                comment_id: _data.id,
                books_id: reqData.books_id
              }),
              type: virtualType.books,
              action: modelAction.obtain_comment,
              ass_uid: user.uid
            })
          }

          if (oneBooks.uid !== user.uid && !reqData.reply_id) {
            await userMessage.setMessage({
              uid: oneBooks.uid,
              sender_id: user.uid,
              action: userMessageAction.comment, // 动作：评论
              type: modelType.books, // 类型：小书评论
              content: JSON.stringify({
                comment_id: _data.id,
                books_id: reqData.books_id
              })
            })
          }

          if (
            reqData.reply_id &&
            reqData.reply_id !== 0 &&
            reqData.reply_uid !== user.uid
          ) {
            await userMessage.setMessage({
              uid: reqData.reply_uid,
              sender_id: user.uid,
              action: userMessageAction.reply, // 动作：回复
              type: modelType.books_comment, // 类型：小书回复
              content: JSON.stringify({
                reply_id: reqData.reply_id,
                comment_id: _data.id,
                books_id: reqData.books_id
              })
            })
          }

          resClientJson(res, {
            state: 'success',
            data: _data,
            message:
              Number(status) === freeReview ? '评论成功' : '评论成功,待审核可见'
          })
        })
        .catch((err: any) => {
          resClientJson(res, {
            state: 'error',
            message: '回复失败:' + err
          })
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
   * 删除评论post提交
   * @param   {object} ctx 上下文对象
   */
  static async deleteBooksComment(req: any, res: any, next: any) {
    let reqData = req.body
    let { user = '' } = req

    try {
      let allComment = await models.books_comment
        .findAll({ where: { parent_id: reqData.comment_id } })
        .then((res: any) => {
          return res.map((item: any, key: string) => {
            return item.id
          })
        })

      if (allComment.length > 0) {
        // 判断当前评论下是否有子评论,有则删除子评论
        await models.books_comment.destroy({
          where: {
            id: { [Op.in]: allComment },
            uid: user.uid
          }
        })
      }

      await models.books_comment.destroy({
        where: {
          id: reqData.comment_id,
          uid: user.uid
        }
      })

      await models.books.update(
        {
          // 更新小书评论数
          comment_count: await models.books_comment.count({
            where: {
              books_id: reqData.books_id,
              parent_id: 0
            }
          })
        },
        { where: { books_id: reqData.books_id } }
      )

      resClientJson(res, {
        state: 'success',
        message: '删除成功'
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

export default BooksComment
