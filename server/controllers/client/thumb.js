const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { render, resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType
} = require('../../utils/constant')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}
const { TimeNow, TimeDistance } = require('../../utils/time')

class Thumb {
  /**
   * 用户like动态post
   * @param   {object} ctx 上下文对象
   */
  static async setUserLikeDynamic (ctx) {
    const { dynamic_id } = ctx.request.body
    let { user = '' } = ctx.request
    let type = ''
    try {
      let oneUserLikeArticle = await models.thumb_dynamic.findOne({
        where: {
          uid: user.uid,
          dynamic_id
        }
      })

      if (oneUserLikeArticle) {
        /* 判断是否like动态，是则取消，否则添加 */
        type = 'cancel'
        await models.thumb_dynamic.destroy({
          where: {
            uid: user.uid,
            dynamic_id
          }
        })
      } else {
        type = 'like'
        await models.thumb_dynamic.create({
          uid: user.uid,
          dynamic_id
        })
        // 暂时取消
        // await models.user_message.create({
        //   // 用户行为记录
        //   uid: uid,
        //   type: 6, // 1:系统消息 2:喜欢文章  3:关注标签 4:用户关注 5:评论
        //   content: JSON.stringify({
        //     other_uid: user.uid,
        //     aid: aid,
        //     title: '文章有新的喜欢'
        //   })
        // })
      }

      let dynamicLikeCount = await models.thumb_dynamic.count({
        where: {
          dynamic_id
        }
      })

      await models.dynamic.update(
        {
          like_count: dynamicLikeCount
        },
        { where: { id: dynamic_id } }
      )

      resClientJson(ctx, {
        state: 'success',
        data: {
          type
        },
        message: type === 'like' ? 'like动态成功' : '取消like动态成功'
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

module.exports = Thumb
