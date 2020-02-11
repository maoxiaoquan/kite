const models = require('../../../../db/mysqldb/index')
const { resAdminJson } = require('../../utils/resData')
import moment from 'moment'
const Op = require('sequelize').Op


class Dynamics {
  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getDynamicList(req: any, res: any, next: any) {
    const { page = 1, pageSize = 10, content, status, type } = req.body

    let whereParams: any = {} // 定义查询条件

    content && (whereParams['content'] = { [Op.like]: `%${content}%` })
    status && (whereParams['status'] = status)
    type && (whereParams['type'] = type)

    try {
      let { count, rows } = await models.dynamic.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize), // 每页限制返回的数据条数
        order: [['create_timestamp', 'desc']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date)
            .format('YYYY-MM-DD H:m:s')
            .toLocaleString()
        )
        rows[i].setDataValue(
          'user',
          await models.user.findOne({
            where: { uid: rows[i].uid },
            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
          })
        )
      }

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 更新动态
   * @param   {object} ctx 上下文对象
   */
  static async updateDynamic(req: any, res: any, next: any) {
    const { id, status, type, rejection_reason, topic_ids } = req.body
    try {
      await models.dynamic.update(
        {
          status,
          type,
          rejection_reason,
          topic_ids
        },
        {
          where: {
            id // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新动态成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }

  /**
   * 删除动态
   * @param   {object} ctx 上下文对象
   * 删除动态判断是否有动态
   * 无关联则直接删除动态，有关联则开启事务同时删除与动态的关联
   */
  static async deleteDynamic(req: any, res: any, next: any) {
    const { id } = req.body
    try {
      let oneDynamic = await models.dynamic.findOne({ where: { id } })
      if (oneDynamic) {
        await models.dynamic.destroy({ where: { id } })
        resAdminJson(res, {
          state: 'success',
          message: '删除动态成功'
        })
      } else {
        throw new Error('删除动态失败!')
      }
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
    }
  }
}

export default Dynamics
