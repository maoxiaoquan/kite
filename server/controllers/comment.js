const models = require('../../db/mysqldb')
const moment = require('moment')
const { render, home_resJson } = require('../utils/res_data')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

/*评论模块*/

class Comment {
  constructor() {}

  static async get_comment(ctx) {
    let aid = ctx.query.aid
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 10

    console.log('pageSize', pageSize)

    let { count, rows } = await models.comment
      .findAndCountAll({
        // 默认一级评论
        where: { aid, parent_id: 0 }, //为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), //每页限制返回的数据条数
        order: [['create_date_timestamp', 'desc']]
      })
      .then(res => {
        return JSON.parse(JSON.stringify(res))
      })

    for (let item in rows) {
      // 循环取用户
      await (async i => {
        rows[i].user = {}
        let data = await models.user
          .findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
          .then(res => {
            return JSON.parse(JSON.stringify(res))
          })
        if (data) {
          rows[i].user = data
        }
      })(item)
    }

    for (let item in rows) {
      // 循环取子评论
      await (async i => {
        rows[i].children = []
        let child_data = await models.comment
          .findAll({
            where: { parent_id: rows[i].id }
          })
          .then(res => {
            return JSON.parse(JSON.stringify(res))
          })

        for (let child_item in child_data) {
          // 循环取用户  代码有待优化，层次过于复杂
          await (async j => {
            child_data[j].user = {}
            let data = await models.user
              .findOne({
                where: { uid: rows[j].uid },
                attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
              })
              .then(res => {
                return JSON.parse(JSON.stringify(res))
              })
            if (data) {
              child_data[j].user = data
            }
          })(child_item)
        }

        if (child_data) {
          rows[i].children = child_data
        }
      })(item)
    }

    await home_resJson(ctx, {
      state: 'success',
      message: '获取评论列表成功',
      data: {
        page,
        pageSize,
        count,
        comment_list: rows
      }
    })
  }

  /**
   * 新建评论post提交
   * @param   {obejct} ctx 上下文对象
   */
  static async post_create_comment(ctx) {
    let formData = ctx.request.body

    console.log('formData', formData.article_uid)
    try {
      if (!formData.content) {
        throw new err_mess('请输入评论内容')
      }
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    try {
      await models.comment
        .create({
          parent_id: formData.parent_id || 0,
          aid: formData.aid,
          uid: formData.uid,
          reply_uid: formData.reply_uid || '',
          content: formData.content,
          status: 1
        })
        .then(async data => {
          await models.article.update(
            {
              // 更新文章评论数
              comment_count: await models.comment.count({
                where: { aid: formData.aid, parent_id: 0 }
              })
            },
            { where: { aid: formData.aid } }
          )

          const user_info = await models.user.findOne({
            where: { uid: data.uid }
          }) // 查询当前评论用户的信息

          let _data = {
            // 组合返回的信息
            ...data.get({
              plain: true
            }),
            children: [],
            user: user_info
          }

          // 行为日志

          await models.user_message.create({
            // 用户行为记录
            uid: formData.article_uid,
            other_uid: ctx.session.uid,
            type: 5, // 类型 1 喜欢文章  2 关注标签 3 关注用户 4 评论回复 5 文章有新的评论
            comment_id: _data.id,
            aid: formData.aid,
            title: '文章有新的评论',
            content: formData.content
          })

          if (formData.reply_uid) {
            await models.user_message.create({
              // 用户行为记录
              uid: formData.reply_uid,
              other_uid: ctx.session.uid,
              type: 4, // 类型 1 喜欢文章  2 关注标签 3 关注用户 4 评论回复 5 文章有新的评论
              comment_id: _data.id,
              aid: formData.aid,
              title: '你的评论有新的回复',
              content: formData.content
            })
          }

          home_resJson(ctx, {
            state: 'success',
            message: '回复成功',
            data: _data
          })
        })
        .catch(err => {
          home_resJson(ctx, {
            state: 'error',
            message: '回复失败'
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
   * 删除评论post提交
   * @param   {obejct} ctx 上下文对象
   */
  static async post_delete_comment(ctx) {
    let formData = ctx.request.body

    let find_children_comment_id = await models.comment
      .findAll({ where: { parent_id: formData.comment_id } })
      .then(res => {
        return res.map((item, key) => {
          return item.id
        })
      })

    try {
      if (find_children_comment_id.length > 0) {
        // 判断当前评论下是否有子评论,有则删除子评论
        await models.comment.destroy({
          where: {
            id: { in: find_children_comment_id },
            uid: ctx.session.uid
          }
        })
      }

      await models.comment
        .destroy({
          where: {
            id: formData.comment_id,
            uid: ctx.session.uid
          }
        })
        .then(async data => {
          await models.article.update(
            {
              // 更新文章评论数
              comment_count: await models.comment.count({
                where: { aid: formData.aid, parent_id: 0 }
              })
            },
            { where: { aid: formData.aid } }
          )

          home_resJson(ctx, {
            state: 'success',
            message: '删除成功'
          })
        })
        .catch(err => {
          home_resJson(ctx, {
            state: 'error',
            message: '删除失败'
          })
        })
    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
    }
  }
}

module.exports = Comment
