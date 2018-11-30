const models = require('../../../db/mysqldb/index')
const {sign_resJson, admin_resJson} = require('../../utils/res_data')
const {
  tools: {encrypt}
} = require('../../utils/index')
const config = require('../../../config')
const moment = require('moment')
const {create_admin_system_log} = require('./admin_system_log')

class AdminIndex {

  static async admin_index_statistics (ctx) {

    let admin_user_count = await models.admin_user.count() // 后台用户统计
    let user_count = await models.user.count() // 前台用户统计
    let article_count = await models.article.count() // 文章统计
    let comment_count = await models.comment.count() // 评论统计

    let new_user = await models.user.findAll({
      limit: 10, //每页限制返回的数据条数
      attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
      order: [['create_date_timestamp', 'desc']]
    })

    let new_article = await models.article.findAll({
      limit: 10, //每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    })

    for (let i in new_article) {
      new_article[i].setDataValue('create_at', await moment(new_article[i].create_date).format('YYYY-MM-DD'))
      new_article[i].setDataValue('user', await models.user.findOne({
        where: {uid: new_article[i].uid},
        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
      }))
    }

    admin_resJson(ctx, {
      state: 'success',
      message: '获取统计信息成功',
      data: {
        count: {
          admin_user_count,
          user_count,
          article_count,
          comment_count
        },
        new_article,
        new_user
      }
    })
  }
}

module.exports = AdminIndex
