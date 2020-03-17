const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const trimHtml = require('trim-html')
const xss = require('xss')
const clientWhere = require('../../utils/clientWhere')
const config = require('../../../../config')
const shortid = require('shortid')
const lowdb = require('../../../../db/lowdb/index')
import {
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualPlusLess,
  productTypeInfo,
  isFree,
  modelInfo,
  modelName
} from '../../utils/constant'

const userMessage = require('../../utils/userMessage')
const userVirtual = require('../../common/userVirtual')
import useExperience from '../../common/useExperience'
const { TimeNow, TimeDistance } = require('../../utils/time')

/* 动态专题模块模块 */
// 获取动态专题详情

class Collect {
  static async setCollect(req: any, res: any, next: any) {
    try {
      const { associate_id, type } = req.body
      const { user = '' } = req
      let associateType = ''
      if (!modelInfo[type]) {
        throw new Error('类型不存在，系统已禁止行为')
      }
      if (!associate_id) {
        throw new Error('关联ID不存在')
      }
      const oneModelInfo = await models[modelInfo[type].model].findOne({
        where: {
          [modelInfo[type].idKey]: associate_id
        }
      })

      if (!oneModelInfo) {
        throw new Error('模型不存在')
      }

      let oneAttention = await models.collect.findOne({
        where: {
          uid: user.uid,
          type,
          associate_id
        }
      })

      if (oneAttention) {
        /* 判断是否关注了 */
        associateType = oneAttention.is_associate ? 'cancel' : 'enter'
        await models.collect.update(
          {
            is_associate: !oneAttention.is_associate
          },
          {
            where: {
              uid: user.uid,
              type,
              associate_id
            }
          }
        )
      } else {
        associateType = 'enter' // 只在第一次收藏的时候提交推送
        // 收藏，只在用户第一关注的时候推送消息

        // 订阅消息，只在用户第一关注的时候推送消息
        await userMessage.setMessage({
          uid: oneModelInfo.uid,
          sender_id: user.uid,
          action: userMessageAction.collect, // 动作：收藏
          type: type, // 类型：点赞
          content: associate_id
        })

        await models.collect.create({
          uid: user.uid,
          associate_id,
          type,
          is_associate: true
        })
      }

      resClientJson(res, {
        state: 'success',
        message: associateType === 'enter' ? '收藏成功' : '取消收藏成功',
        data: {
          type: associateType
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

  /**
   * 我的收藏列表
   * @param   {object} ctx 上下文对象
   */
  static async getCollectList(req: any, res: any, next: any) {
    let page = req.query.page || 1
    let type = req.query.type || ''
    let pageSize = Number(req.query.pageSize) || 10
    let { user = '' } = req
    let whereParams: any = {
      // 查询参数
      is_associate: true,
      uid: user.uid
    }

    type && (whereParams['type'] = type)

    try {
      let { count, rows } = await models.collect.findAndCountAll({
        where: whereParams, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_date', 'DESC']]
      })
      for (let i in rows) {
        let model = modelInfo[rows[i].type].model
        let idKey = modelInfo[rows[i].type].idKey
        const info = await models[model].findOne({
          where: {
            [idKey]: rows[i].associate_id
          }
        })
        rows[i].setDataValue('info', info || {})
      }

      resClientJson(res, {
        state: 'success',
        data: {
          count,
          list: rows,
          page,
          pageSize
        },
        message: '获取收藏信息成功'
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

export default Collect
