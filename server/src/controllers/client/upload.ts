const models = require('../../../../db/mysqldb/index')
const { resClientJson } = require('../../utils/resData')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../../../config')
import moment from 'moment'
const multer = require('nodemailer')
const upload = require('../../utils/upload') // 上传工具类
const fs = require('fs')
const path = require('path')

const lowdb = require('../../../../db/lowdb/index')

const Op = require('sequelize').Op

class Upload {
  /**
   * 用户头像上传修改
   * @param   {object} ctx 上下文对象
   */
  static async uploadUserAvatar(req: any, res: any, next: any) {
    try {
      const website = lowdb
        .read()
        .get('website')
        .value()
      const { avatar } = req.body

      let { user = '' } = req
      let userRoleAll = await models.user_role.findAll({
        where: {
          user_role_id: {
            [Op.or]: user.user_role_ids.split(',')
          },
          user_role_type: 1 // 用户角色类型1是默认角色
        }
      })
      let userAuthorityIds = ''
      userRoleAll.map((roleItem: any) => {
        userAuthorityIds += roleItem.user_authority_ids + ','
      })
      let message = ''
      if (~userAuthorityIds.indexOf(config.USER.dfUserAvatarNoReviewId)) {
        message = '上传用户头像成功'
        await models.user.update(
          {
            avatar
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
        await models.user_info.update(
          {
            avatar_review_status: 2
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
      } else {
        message = '上传用户头像成功，头像正在审核中'
        await models.user_info.update(
          {
            avatar_review: avatar,
            avatar_review_status: 1
          },
          {
            where: {
              uid: user.uid // 查询条件
            }
          }
        )
      }

      resClientJson(res, {
        state: 'success',
        message: message
      })

    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '上传图片大于1m'
      })
      return false
    }
  }


  // 文件上传
  static async uploadFile(req: any, res: any, next: any) {
    try {
      if (req.file) {
        let file = req.file
        resClientJson(res, {
          state: 'success',
          message: '上传成功',
          data: {
            fileUrl: file
          }
        })
      } else {
        resClientJson(res, {
          state: 'error',
          message: '上传成功失败，文件格式有误'
        })
      }
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '上传图片大于1m'
      })
      return false
    }
  }


}

export default Upload
