const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const sequelize = require('sequelize')
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../../../config')
const lowdb = require('../../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../utils/time')
import {
  userMessageAction,
  virtualPlusLess,
  modelAction,
  virtualInfo,
  modelActionText,
  modelInfo,
  modelName
} from '../../utils/constant'

const modelNameNum = Object.values(modelName)
import userVirtual from '../../common/userVirtual'

class Virtual {
  // 签到
  static async checkIn(req: any, res: any, next: any) {
    try {
      let { user = '' } = req
      let date = new Date()
      let getTime = date.setHours(date.getHours())
      let startTime = new Date(new Date(getTime).setHours(0, 0, 0, 0)) // 当天0点
      let endTime = new Date(new Date(getTime).setHours(23, 59, 59, 999))

      let oneVirtual = await models.virtual.count({
        where: {
          uid: user.uid,
          type: modelName.system,
          action: modelAction.check_in,
          create_date: {
            [Op.gt]: startTime, //  >
            [Op.lt]: endTime //  <
          }
        }
      })

      if (oneVirtual > 0) {
        throw new Error('当天已签到')
      } else {
        await userVirtual.setVirtual({
          uid: user.uid,
          type: modelName.system,
          action: modelAction.check_in
        })
      }

      await resClientJson(res, {
        state: 'success',
        message: '签到成功'
      })
    } catch (err) {
      console.log('err', err)
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
  /**
   * 获取消费列表
   * @param   {object} ctx 上下文对象
   */
  static async getVirtualList(req: any, res: any, next: any) {
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let { user = '' } = req
    try {
      let { count, rows } = await models.virtual.findAndCountAll({
        where: {
          uid: user.uid
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_date', 'DESC']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date).format('YYYY-MM-DD')
        )
        rows[i].setDataValue(
          'ass_user',
          await models.user.findOne({
            where: { uid: rows[i].ass_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        rows[i].setDataValue('actionText', modelActionText[rows[i].action])
        rows[i].setDataValue('typeText', modelInfo[rows[i].type].name)

        if (
          rows[i].associate &&
          rows[i].type !== modelName.user &&
          ~modelNameNum.indexOf(rows[i].type)
        ) {
          // 排除关注用户
          rows[i].setDataValue(
            'modelInfo',
            await models[modelInfo[rows[i].type].model].findOne({
              where: { [modelInfo[rows[i].type].idKey]: rows[i].associate }
            }) || {}
          )
        }
      }

      await resClientJson(res, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count,
          list: rows,
          page,
          pageSize
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

export default Virtual
