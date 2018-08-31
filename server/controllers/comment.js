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

  static async get_comment (ctx) {

    let aid = ctx.query.aid
    let page = ctx.query.page || 1
    let pageSize = ctx.query.pageSize || 25

    let {count, rows} = await models.comment.findAndCountAll({
      where: {aid},//为空，获取全部，也可以自己添加条件
      offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
      limit: pageSize,//每页限制返回的数据条数
      order: [['create_date_timestamp', 'desc']]
    }).then((res) => {
      return JSON.parse(JSON.stringify(res))
    })

    let arr = []

    for (let item in rows) {
      if (rows[item].parent_id === 0) {
        arr.push(rows[item])
      }
    }

    for (let item in arr) {
      arr[item].children = []
      for (let item_arr in rows) {
        if (rows[item_arr].parent_id === arr[item].id) {
          arr[item].children.unshift(rows[item_arr])
        }
      }
    }

    await home_resJson(ctx, {
      state: 'success',
      message: '获取评论列表成功',
      data: {
        page,
        pageSize,
        count,
        comment_list: arr
      }
    })

  }

  /**
   * 新建评论post提交
   * @param   {obejct} ctx 上下文对象
   */
  static async post_create_comment (ctx) {

    let formData = ctx.request.body

    try {

      if (!formData.content) {
        throw  new err_mess('请输入评论内容')
      }

    } catch (err) {
      home_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }

    try {
      await models.comment.create({
        parent_id: formData.parent_id || 0,
        aid: formData.aid,
        uid: formData.uid,
        reply_uid: formData.reply_uid || '',
        content: formData.content,
        create_date: moment().utc().utcOffset(+8).format(), /*时间*/
        create_date_timestamp: moment().utc().utcOffset(+8).format('X'), /*时间戳 */
        status: 1
      }).then(async (data) => {
        let _data = {
          ...data.get({
            plain: true
          }),
          children: [],
          user: await models.user.findOne({where: {uid: data.uid}})
        }
        home_resJson(ctx, {
          state: 'success',
          message: '回复成功',
          data: _data
        })
      }).catch((err) => {
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
}

module.exports = Comment