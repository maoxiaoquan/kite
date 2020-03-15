const models = require('../../../db/mysqldb/index')
import moment from 'moment'
import {
  virtualInfo,
  modelName,
  modelInfo,
  modelAction,
  experienceInfo
} from '../utils/constant'
const lowdb = require('../../../db/lowdb/index')
const config = lowdb.read().value()
const Op = require('sequelize').Op

function isDigit(value: any) {
  var patrn = /^[0-9]*$/
  if (patrn.exec(value) == null || value == '') {
    return false
  } else {
    return true
  }
}

class useExperience {
  // 用户经验

  /**
   * 目前获取经验的方法
   * 阅读文章、阅读动态、文章被点赞、动态被点赞、发表评论
   * @param   {object} type 上下文对象
   */

  static setExperience(params: any) {
    // 用户经验
    return new Promise(async (resolve, reject) => {
      try {
        const userInfo = await models.user_info.findOne({
          where: {
            uid: params.uid
          }
        })

        let date = new Date()
        let getTime = date.setHours(date.getHours())
        let startTime = new Date(new Date(getTime).setHours(0, 0, 0, 0)) // 当天0点
        let endTime = new Date(new Date(getTime).setHours(23, 59, 59, 999))

        const countTodayExperience = await models.experience.count({
          // 当前类型的当天的数量
          where: {
            uid: params.uid,
            ass_uid: params.ass_uid,
            type: params.type,
            action: params.action,
            create_date: {
              [Op.gt]: startTime, //  >
              [Op.lt]: endTime //  <
            }
          }
        })

        const currTodayExperience = await models.experience.count({
          // 当前类型的对象当天的数量
          where: {
            uid: params.uid,
            ass_uid: params.ass_uid,
            type: params.type,
            action: params.action,
            associate: params.associate,
            create_date: {
              [Op.gt]: startTime, //  >
              [Op.lt]: endTime //  <
            }
          }
        })

        let value = experienceInfo[params.action]
        let experience = Number(userInfo.experience)
        const total = experience + value

        async function newAddExperience() {
          return await models.sequelize.transaction((t: any) => {
            // 在事务中执行操作
            return models.experience
              .create(
                {
                  total,
                  value,
                  ...params
                },
                { transaction: t }
              )
              .then(() => {
                return models.user_info.update(
                  {
                    experience: total
                  },
                  {
                    where: {
                      uid: params.uid
                    }
                  },
                  { transaction: t }
                )
              })
          })
        }

        if (params.action === modelAction.readOther) {
          // 属于阅读的时候
          if (countTodayExperience < 5 && currTodayExperience === 0) {
            // 阅读试通一个类型，一天可以获得5次经验 对象不可重复
            // 当天可获取的经验类型
            await newAddExperience()
          }
        } else if (params.action === modelAction.obtain_thumb) {
          // 属于点赞的时候一天可获得的经验为无数次
          await newAddExperience()
        }

        resolve({ status: 'success' }) // 这里不管是正确还是失败，都返回resolve
      } catch (err) {
        console.log('err', err)
        resolve({ status: 'error' })
      }
    })
  }
}

export default useExperience
