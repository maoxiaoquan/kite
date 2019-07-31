const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class PersonalCenter {
  /**
   * 用户个人中心个人文章列表render
   * @param   {object} ctx 上下文对象
   */
  static async userMyArticle (ctx) {
    let uid = ctx.query.uid
    let blog_id = ctx.query.blog_id || 'all'
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    try {
      let whereParams =
        blog_id === 'all'
          ? { uid, ...clientWhere.article.me }
          : {
            uid,
            user_blog_ids: blog_id,
            ...clientWhere.article.me
          }
      let { count, rows } = await models.article.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
      rows[item].create_at = await moment(rows[item].create_date)
        .format('YYYY-MM-DD H:m:s')
      rows[item].user = await models.user.findOne({
        where: { uid: rows[item].uid },
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      })
      } */

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

      await resClientJson(ctx, {
        state: 'success',
        message: 'home',
        data: {
          count: count,
          blog_id,
          page,
          pageSize,
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
   * 用户个人中心用户关注用户render
   * @param   {object} ctx 上下文对象
   */
  static async getUserAttentionList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    let any = ctx.query.any || 'me'

    let userAttentionUidArr
    try {
      let meAttention = await models.user_attention
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((attention_item, tag_key) => {
            return attention_item.attention_uid
          })
        })
      let otherAttention = await models.user_attention
        .findAll({ where: { attention_uid: uid } })
        .then(res => {
          return res.map((attention_item, tag_key) => {
            return attention_item.uid
          })
        })

      if (any === 'me') {
        userAttentionUidArr = meAttention
      } else {
        userAttentionUidArr = otherAttention
      }

      let { count, rows } = await models.user.findAndCountAll({
        where: { uid: { [Op.in]: userAttentionUidArr } }, // 为空，获取全部，也可以自己添加条件
        attributes: [
          'uid',
          'avatar',
          'nickname',
          'sex',
          'introduction',
          'user_role_ids'
        ],
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      await resClientJson(ctx, {
        state: 'success',
        message: 'home',
        data: {
          count,
          page,
          pageSize,
          user_list: rows,
          me_attention: meAttention,
          other_attention: otherAttention,
          any
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
   * 用户关注用户post
   * @param   {object} ctx 上下文对象
   */
  static async setUserAttention (ctx) {
    const { attention_uid } = ctx.request.body
    let { user = '' } = ctx.request

    try {
      if (attention_uid === user.uid) {
        throw new ErrorMessage('关注用户失败，自己不能关注自己')
      }
      let oneUserAttention = await models.user_attention.findOne({
        where: {
          uid: user.uid,
          attention_uid
        }
      })

      if (oneUserAttention) {
        /* 判断是否关注了，是则取消，否则添加 */

        await models.user_attention.destroy({
          where: {
            uid: user.uid,
            attention_uid
          }
        })
        resClientJson(ctx, {
          state: 'success',
          message: '取消关注用户成功'
        })
      } else {
        await models.user_attention.create({
          uid: user.uid,
          attention_uid
        })
        await models.user_message.create({
          // 用户行为记录
          uid: attention_uid,
          type: 4, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
          content: JSON.stringify({
            other_uid: user.uid,
            title: '有新的关注'
          })
        })

        resClientJson(ctx, {
          state: 'success',
          message: '关注用户成功'
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

  /**
   * 用户like文章render
   * @param   {object} ctx 上下文对象
   */
  static async getUserLikeArticleList (ctx) {
    let uid = ctx.query.uid
    let page = ctx.query.page || 1
    let pageSize = Number(ctx.query.pageSize) || 10
    try {
      let allUserLikeArticle = await models.article_like
        .findAll({ where: { uid } })
        .then(res => {
          return res.map((item, key) => {
            return item.aid
          })
        })

      let where_params = { aid: { [Op.in]: allUserLikeArticle } }

      let { count, rows } = await models.article.findAndCountAll({
        where: where_params, // 为空，获取全部，也可以自己添加条件
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

      await resClientJson(ctx, {
        state: 'success',
        message: 'home',
        data: {
          count: count,
          page,
          pageSize,
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
   * 用户like文章post
   * @param   {object} ctx 上下文对象
   */
  static async setUserLikeArticle (ctx) {
    const { aid, uid } = ctx.request.body
    let { user = '' } = ctx.request
    try {
      let oneUserLikeArticle = await models.article_like.findOne({
        where: {
          uid: user.uid,
          aid
        }
      })

      if (oneUserLikeArticle) {
        /* 判断是否like文章，是则取消，否则添加 */

        await models.sequelize.transaction(function (transaction) {
          // 在事务中执行操作
          return models.article_like
            .destroy(
              {
                where: {
                  uid: user.uid,
                  aid
                }
              },
              { ...transaction }
            ) /* 删除user article关联 */
            .then(function (user_like_article_destroy) {
              return models.article_like.count(
                {
                  where: {
                    aid
                  }
                },
                { ...transaction }
              )
              /* 获取文章所有like数 */
            })
            .then(function (user_like_article_count) {
              return models.article.update(
                {
                  like_count: user_like_article_count
                },
                { where: { aid } },
                { ...transaction }
              )
              /* 修改文章like数 */
            })
        })
        resClientJson(ctx, {
          state: 'success',
          data: {
            type: 'cancel'
          },
          message: '取消like文章成功'
        })
      } else {
        await models.sequelize.transaction(function (transaction) {
          // 在事务中执行操作
          return models.article_like
            .create(
              {
                uid: user.uid,
                aid
              },
              { ...transaction }
            ) /* 添加user article关联 */
            .then(function (user_like_article_destroy) {
              return models.article_like.count(
                {
                  where: {
                    aid
                  }
                },
                { ...transaction }
              )
              /* 获取文章所有like数 */
            })
            .then(function (user_like_article_count) {
              return models.article.update(
                {
                  like_count: user_like_article_count
                },
                { where: { aid } },
                { ...transaction }
              )
              /* 修改文章like数 */
            })
        })
        await models.user_message.create({
          // 用户行为记录
          uid: uid,
          type: 2, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
          content: JSON.stringify({
            other_uid: user.uid,
            aid: aid,
            title: '文章有新的喜欢'
          })
        })
        resClientJson(ctx, {
          state: 'success',
          data: {
            type: 'like'
          },
          message: 'like文章成功'
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
}

module.exports = PersonalCenter
