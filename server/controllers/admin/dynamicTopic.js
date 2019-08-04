const models = require('../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
const { createAdminSystemLog } = require('./adminSystemLog')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class dynamicTopic {
  /**
   * -----------------------------------权限操作--------------------------------
   * 创建专题
   * @param   {object} ctx 上下文对象
   */
  static async createDynamicTopic (ctx) {
    const reqData = ctx.request.body

    try {
      let oneDynamicTopicName = await models.dynamic_topic.findOne({
        where: { name: reqData.name }
      })
      if (oneDynamicTopicName) {
        throw new ErrorMessage('专题名已存在!')
      }
      let onedynamicTopicEnName = await models.dynamic_topic.findOne({
        where: { en_name: reqData.en_name }
      })
      if (onedynamicTopicEnName) {
        throw new ErrorMessage('专题名英文已存在!')
      }

      await models.dynamic_topic.create({
        name: reqData.name,
        en_name: reqData.en_name,
        icon: reqData.icon || '/default/img/tag.webp',
        description: reqData.description,
        enable: reqData.enable,
        sort: reqData.sort,
        is_show: reqData.is_show
      })
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功创建了‘${reqData.name}’动态专题`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '专题创建成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取专题列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getDynamicTopicList (ctx) {
    const { page = 1, pageSize = 10 } = ctx.query
    try {
      let { count, rows } = await models.dynamic_topic.findAndCountAll({
        attributes: [
          'id',
          'topic_id',
          'name',
          'en_name',
          'icon',
          'description',
          'rss_count',
          'enable',
          'sort',
          'is_show',
          'enable'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [
          ['sort', 'ASC'] // asc
        ]
      })
      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取所有专题操作
   * @param   {object} ctx 上下文对象
   */
  static async getDynamicTopicAll (ctx) {
    try {
      let allDynamicTopic = await models.dynamic_topic.findAll({
        attributes: [
          'id',
          'topic_id',
          'name',
          'en_name',
          'icon',
          'description',
          'rss_count',
          'enable',
          'sort',
          'is_show',
          'enable'
        ],
        where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
      })
      resAdminJson(ctx, {
        state: 'success',
        message: '返回成功',
        data: {
          all: allDynamicTopic
        }
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新专题
   * @param   {object} ctx 上下文对象
   */
  static async updateDynamicTopic (ctx) {
    const reqData = ctx.request.body
    try {
      await models.dynamic_topic.update(
        {
          name: reqData.name,
          en_name: reqData.en_name,
          icon: reqData.icon || '/default/img/tag.webp',
          description: reqData.description,
          enable: reqData.enable,
          sort: reqData.sort,
          is_show: reqData.is_show
        },
        {
          where: {
            topic_id: reqData.topic_id // 查询条件
          }
        }
      )
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功更新了id为‘${reqData.topic_id}’的动态专题名字为‘${reqData.name}’`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '更新专题成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 删除专题
   */
  static async deleteDynamicTopic (ctx) {
    const { topic_id } = ctx.request.body
    try {
      let oneDynamicTopic = await models.dynamic_topic.findOne({
        where: { topic_id }
      })

      await models.dynamic_topic.destroy({ where: { topic_id } })
      await createAdminSystemLog({
        // 写入日志
        uid: ctx.request.userInfo.uid,
        type: 1,
        content: `成功删除了‘${oneDynamicTopic.name}’动态专题`
      })

      resAdminJson(ctx, {
        state: 'success',
        message: '删除用户成功'
      })
    } catch (err) {
      resAdminJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = dynamicTopic
