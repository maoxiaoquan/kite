const { resAdminJson, resClientJson } = require('../utils/resData')
const models = require('../../db/mysqldb/index')
const config = require('../config')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

const noLimit = ['/admin-index/statistics', '/admin-user/info']

class VerifyAuthority {
  // 前台权限验证
  static async ClientCheck (ctx, next) {
    const { url, user = {} } = req
    const { user_role_ids } = user
    try {
      if (user_role_ids) {
        // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
        /* 判断当前登录用户是否有角色，否则无任何权限 */

        let clientUrl = ''
        if (~url.indexOf('?')) {
          clientUrl = url.split('?')[0]
        } else {
          clientUrl = url
        }
        let oneUserAuthority = await models.user_authority.findOne({
          where: { authority_url: clientUrl.split('/api-client/v1')[1] }
        })
        if (oneUserAuthority) {
          let allUserRole = await models.user_role.findAll({
            where: {
              user_role_id: {
                [Op.in]: user_role_ids.split(',')
              },
              user_authority_ids: {
                [Op.like]: `%${oneUserAuthority.authority_id}%`
              },
              user_role_type: 1 // 用户角色类型1是默认角色
            }
          })
          if (allUserRole && allUserRole.length > 0) {
            await next()
          } else {
            throw new ErrorMessage(
              '当前功能用户无权限或者当前用户已被网站管理员禁用此功能，请联系管理员开启!'
            )
          }
        } else {
          // 排除没有设置的接口
          await next()
        }
      } else {
        resClientJson(res, {
          state: 'error',
          message: '当前用户账号出现问题'
        })
      }
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: `错误提示:${err.message}`
      })
    }
  }

  // 后台权限验证
  static async AdminCheck (ctx, next) {
    const { url, userInfo = {} } = req
    const { role_id } = userInfo
    if (role_id && role_id !== config.SUPER_ROLE_ID) {
      // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
      /* 判断当前登录用户是否有角色，否则无任何权限 */
      let adminUrl = ''
      if (~url.indexOf('?')) {
        adminUrl = url.split('?')[0]
      } else {
        adminUrl = url
      }
      try {
        let oneAdminAuthority = await models.admin_authority.findOne({
          where: { authority_url: adminUrl.split('/api-admin/v1')[1] }
        })
        if (oneAdminAuthority) {
          let oneAdminRole = await models.admin_role.findOne({
            where: {
              role_id: role_id
            }
          })
          if (
            ~oneAdminRole.admin_authority_ids.indexOf(
              oneAdminAuthority.authority_id
            )
          ) {
            await next()
          } else {
            throw new ErrorMessage('当前用户无权限!')
          }
        } else if (~noLimit.indexOf(adminUrl.split('/api-admin/v1')[1])) {
          // 排除某些特定接口
          await next()
        } else {
          throw new ErrorMessage('当前用户无权限!')
        }
      } catch (err) {
        resAdminJson(res, {
          state: 'error',
          message: '当前用户无权限!'
        })
      }
    } else {
      if (role_id === config.SUPER_ROLE_ID) {
        // 超管直接拥有所有权限，设置无否都是拥有最高权限，超管只有一个，某些接口会判断，否则会报错
        await next()
      } else {
        resAdminJson(res, {
          state: 'error',
          message: '当前用户无任何操作权限'
        })
      }
    }
  }
}

module.exports = VerifyAuthority
