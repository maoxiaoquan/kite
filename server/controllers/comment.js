const models = require('../models')
const moment = require('moment')
const {render, home_resJson} = require('../utils/res_data')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

/*评论模块*/

class Comment {

  constructor () {}

}

module.exports = Comment