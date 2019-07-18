const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { client_resJson } = require('../../utils/res_data')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const client_where = require('../../utils/client_where')
const config = require('../../config')

function ErrorMessage(message) {
  this.message = message
  this.name = 'UserException'
}

/* 评论模块 */

class Comment {
  static async get_comment(ctx) {
    let aid = ctx.query.aid
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    try {
      let { count, rows } = await models.comment.findAndCountAll({
        // 默认一级评论
        where: {
          aid,
          parent_id: 0,
          ...client_where.comment
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [['create_date', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_at',
          await moment(rows[i].create_date).format('YYYY-MM-DD H:m:s')
        )
        if (Number(rows[i].status === 1)) {
          rows[i].setDataValue('content', '当前用户评论需要审核')
        }
        if (Number(rows[i].status === 3)) {
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
        let child_data = await models.comment.findAll({
          where: { parent_id: rows[item].id, ...client_where.comment }
        })
        rows[item].setDataValue('children', child_data)
        for (let child_item in child_data) {
          // 循环取用户  代码有待优化，层次过于复杂
          child_data[child_item].setDataValue(
            'create_at',
            await moment(child_data[child_item].create_date).format(
              'YYYY-MM-DD H:m:s'
            )
          )
          child_data[child_item].setDataValue(
            'user',
            await models.user.findOne({
              where: { uid: child_data[child_item].uid },
              attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
            })
          )
          if (child_data[child_item].reply_uid !== 0 && child_data[child_item].reply_uid !== child_data[child_item].uid) {
            child_data[child_item].setDataValue(
              'reply_user',
              await models.user.findOne({
                where: { uid: child_data[child_item].reply_uid },
                attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
              })
            )
          }
        }
      }

      await client_resJson(ctx, {
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
      client_resJson(ctx, {
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
  static async post_create_comment(ctx) {
    let formData = ctx.request.body
    let { user = '' } = ctx.request

    try {
      if (!formData.content) {
        throw new ErrorMessage('请输入评论内容')
      }

      let date = new Date()
      let currDate = moment(date.setHours(date.getHours())).format(
        'YYYY-MM-DD HH:mm:ss'
      )

      if (
        new Date(currDate).getTime() < new Date(user.comment_ban_dt).getTime()
      ) {
        throw new ErrorMessage(
          `当前用户因违规已被管理员禁用发布评论，时间到：${moment(
            user.comment_ban_dt
          ).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`
        )
      }

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
        config.USER_AUTHORITY.comment_review_authority_id
      )
        ? 5
        : 1

      await models.comment
        .create({
          parent_id: formData.parent_id || 0,
          aid: formData.aid,
          uid: user.uid,
          reply_uid: formData.reply_uid || 0,
          content: xss(formData.content),
          status
        })
        .then(async data => {
          await models.article.update(
            {
              // 更新文章评论数
              comment_count: await models.comment.count({
                where: {
                  aid: formData.aid,
                  parent_id: 0
                }
              })
            },
            { where: { aid: formData.aid } }
          )

          const user_info = await models.user.findOne({
            where: { uid: user.uid }
          }) // 查询当前评论用户的信息

          let _data = {
            // 组合返回的信息
            ...data.get({
              plain: true
            }),
            children: [],
            user: user_info
          }
          await models.user_message.create({
            // 用户行为记录
            uid: formData.article_uid,
            type: 5, // 1:系统 2:喜欢文章  3:关注标签 4:关注用户 5:评论
            content: JSON.stringify({
              other_uid: user.uid,
              comment_id: _data.id,
              aid: formData.aid,
              title: '文章有新的评论'
            })
          })

          if (formData.reply_uid) {
            await models.user_message.create({
              // 用户行为记录
              uid: formData.reply_uid,
              type: 5, // 类型 1:系统 2:喜欢文章  3:关注标签 4:用户关注 5:评论
              content: JSON.stringify({
                other_uid: user.uid,
                comment_id: _data.id,
                aid: formData.aid,
                title: `你的评论有新的回复`
              })
            })
          }

          client_resJson(ctx, {
            state: 'success',
            data: _data,
            message:
              Number(status) === 5
                ? '评论成功'
                : '评论成功,但是由于此前您发表的评论存在问题，管理员已把你加入受限用户组，评论需要审核才能被第三人看见'
          })
        })
        .catch(err => {
          client_resJson(ctx, {
            state: 'error',
            message: '回复失败:' + err
          })
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
   * 删除评论post提交
   * @param   {object} ctx 上下文对象
   */
  static async post_delete_comment(ctx) {
    let formData = ctx.request.body
    let { user = '' } = ctx.request

    try {
      let find_children_comment_id = await models.comment
        .findAll({ where: { parent_id: formData.comment_id } })
        .then(res => {
          return res.map((item, key) => {
            return item.id
          })
        })

      if (find_children_comment_id.length > 0) {
        // 判断当前评论下是否有子评论,有则删除子评论
        await models.comment.destroy({
          where: {
            id: { [Op.in]: find_children_comment_id },
            uid: user.uid
          }
        })
      }

      await models.comment.destroy({
        where: {
          id: formData.comment_id,
          uid: user.uid
        }
      })

      await models.article.update(
        {
          // 更新文章评论数
          comment_count: await models.comment.count({
            where: {
              aid: formData.aid,
              parent_id: 0
            }
          })
        },
        { where: { aid: formData.aid } }
      )

      client_resJson(ctx, {
        state: 'success',
        message: '删除成功'
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

module.exports = Comment
