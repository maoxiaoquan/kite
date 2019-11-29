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

class User {
  static async userInfo (uid) {
    let where = {
      uid
    } // 排序参数
    try {
      // where
      let oneUser = await models.user.findOne({
        where: where, // 为空，获取全部，也可以自己添加条件
        attributes: ['uid', 'avatar', 'nickname', 'user_role_ids']
      })
      let oneUserInfo = await models.user_info.findOne({
        where: where, // 为空，获取全部，也可以自己添加条件
        attributes: ['home_page', 'company', 'shell_balance']
      })

      return {
        ...JSON.parse(JSON.stringify(oneUser)),
        ...JSON.parse(JSON.stringify(oneUserInfo))
      }
    } catch (err) {
      return {}
    }
  }
}

module.exports = User
