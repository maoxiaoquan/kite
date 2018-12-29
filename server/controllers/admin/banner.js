const models = require('../../../db/mysqldb')
const {admin_resJson} = require('../../utils/res_data')
const {
  tools: {encrypt}
} = require('../../utils/index')
const config = require('../../../config')
const moment = require('moment')
const {create_admin_system_log} = require('./admin_system_log')

function err_mess (message) {
  this.message = message
  this.name = 'UserException'
}

class Banner {

  /*创建banner*/

  static async create_banner (ctx) {
    const req_data = ctx.request.body

    try {

      if (!req_data.title) {
        throw new err_mess('请输入banner标题!')
      }

      if (req_data.title.length > 100) {
        throw new err_mess('banner标题限制为100个字符!')
      }

      let findOne_banner = await models.banner.findOne({
        where: {
          type: req_data.type,
          sort: req_data.sort
        }
      })

      if (findOne_banner) {
        throw new err_mess('同一类型的序号不可相同')
      }

      if (!req_data.article_url) {
        throw new err_mess('请填写文章的连接!')
      }
      if (!req_data.img_url) {
        throw new err_mess('请输入banner图片连接，可在图床中上传后设置!')
      }
      if (!req_data.type) {
        throw new err_mess('请输入banner类型!')
      }

      await models.banner
        .create({
          title: req_data.title, // 图的标题
          article_url: req_data.article_url, //  文章的连接，或者其他连接
          img_url: req_data.img_url, // 图的连接
          type: req_data.type, // 图的类型
          sort: req_data.sort, // 序号
          description: req_data.description, // 描述
          enable: req_data.enable,
        })
        .then(async p => {

          await create_admin_system_log({
            // 写入日志
            uid: ctx.request.userInfo.uid,
            type: 1,
            content: `成功创建了标题为‘${req_data.title}’的banner`
          })

          admin_resJson(ctx, {
            state: 'success',
            message: 'banner 创建成功'
          })
        })
        .catch(function (err) {
          admin_resJson(ctx, {
            state: 'error',
            message: 'banner 创建出错'
          })
        })

    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

  /**
   * 获取标签列表操作
   * @param   {obejct} ctx 上下文对象
   */
  static async get_banner_list (ctx) {
    const {page = 1, pageSize = 10, type} = ctx.query

    try {
      let {count, rows} = await models.banner.findAndCountAll({
        attributes: [
          'id',
          'title',
          'article_url',
          'img_url',
          'sort',
          'description',
          'type',
          'enable'
        ],
        where: type ? {type} : '', //为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) //每页限制返回的数据条数
      })
      admin_resJson(ctx, {
        state: 'success',
        message: '返回banner成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

  /**
   * 更新Banner
   * @param   {obejct} ctx 上下文对象
   */
  static async update_banner (ctx) {
    const {id, title, article_url, img_url, type, sort, description, enable} = ctx.request.body
    try {
      await models.banner
        .update(
          {
            title, article_url, img_url, type, sort, description, enable
          },
          {
            where: {
              id: id //查询条件
            }
          }
        )
        .then(function (p) {
          admin_resJson(ctx, {
            state: 'success',
            message: '更新Banner成功'
          })
        })
        .catch(function (err) {
          admin_resJson(ctx, {
            state: 'error',
            message: '更新Banner失败'
          })
        })
    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

  /**
   * 删除Banner
   * @param   {obejct} ctx 上下文对象
   */
  static async delete_banner (ctx) {
    const {id} = ctx.request.body

    try {

      await models.banner
        .destroy({where: {id}})
        .then(data => {
          admin_resJson(ctx, {
            state: 'success',
            message: '删除Banner成功'
          })
        })
        .catch(err => {
          admin_resJson(ctx, {
            state: 'error',
            message: '删除Banner失败'
          })
        })

    } catch (err) {
      admin_resJson(ctx, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

}

module.exports = Banner
