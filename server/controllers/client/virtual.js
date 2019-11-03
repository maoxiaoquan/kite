const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../utils/time')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageType,
  userMessageAction
} = require('../../utils/constant')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Virtual {}

module.exports = Virtual
