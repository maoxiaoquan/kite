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
      let { count, rows } = await models.article.findAndCountAll({
        where: where, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: order
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
