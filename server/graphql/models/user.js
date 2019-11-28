const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const { TimeNow, TimeDistance } = require('../../utils/time')
const clientWhere = require('../../utils/clientWhere')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  virtualAction,
  virtualType,
  modelType
} = require('../../utils/constant')

class Article {
  static async getIndex () {
    let page = 1
    let pageSize = 25
    let sort = 'newest'
    let order = [] // 排序参数
    let where = [] // 排序参数
    try {
      // where
      let { count, rows } = await models.user.findOne({
        where: where // 为空，获取全部，也可以自己添加条件
      })

      return {
        count,
        page,
        pageSize,
        list: JSON.parse(JSON.stringify(rows))
      }
    } catch (err) {
      return {
        count: 0,
        page: 1,
        pageSize,
        list: []
      }
    }
  }
}

module.exports = Article
