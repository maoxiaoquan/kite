const { admin_resJson, client_resJson } = require('../utils/res_data')
const models = require('../../db/mysqldb/index')
const config = require('../config')
const Op = require('sequelize').Op

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

const noLimit = ['/admin-index/statistics', '/admin-user/info']

class VerifyAuthority {
  static async ClientCheck (ctx, next) {
    const { url, user = {} } = ctx.request
    const { user_role_ids } = user
    try {
      if (user_role_ids) {
        // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
        /* 判断当前登录用户是否有角色，否则无任何权限 */

        let client_url = ''
        if (~url.indexOf('?')) {
          client_url = url.split('?')[0]
        } else {
          client_url = url
        }
        let find_user_authority = await models.user_authority.findOne({
          where: { authority_url: client_url.split('/api-client/v1')[1] }
        })
        if (find_user_authority) {
          let find_role_all = await models.user_role.findAll({
            where: {
              user_role_id: {
                [Op.or]: user_role_ids.split(',')
              },
              user_role_type: 1 // 用户角色类型1是默认角色
            }
          })
          let user_authority_ids = ''
          find_role_all.map(roleItem => {
            user_authority_ids += roleItem.user_authority_ids + ','
          })
          if (~user_authority_ids.indexOf(find_user_authority.authority_id)) {
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
        client_resJson(ctx, {
          state: 'error',
          message: '当前用户账号出现问题'
        })
      }
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: `错误提示:${err.message}`
      })
    }
  }

  static async AdminCheck (ctx, next) {
    const { url, userInfo = {} } = ctx.request
    const { role_id } = userInfo
    if (role_id && role_id !== config.SUPER_ROLE_ID) {
      // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
      /* 判断当前登录用户是否有角色，否则无任何权限 */
      let admin_url = ''
      if (~url.indexOf('?')) {
        admin_url = url.split('?')[0]
      } else {
        admin_url = url
      }
      try {
        let find_ad_authority = await models.admin_authority.findOne({
          where: { authority_url: admin_url.split('/api-admin/v1')[1] }
        })
        if (find_ad_authority) {
          let find_role = await models.admin_role.findOne({
            where: {
              role_id: role_id
            }
          })
          if (
            ~find_role.admin_authority_ids.indexOf(
              find_ad_authority.authority_id
            )
          ) {
            await next()
          } else {
            throw new ErrorMessage('当前用户无权限!')
          }
        } else if (~noLimit.indexOf(admin_url.split('/api-admin/v1')[1])) {
          // 排除某些特定接口
          await next()
        } else {
          throw new ErrorMessage('当前用户无权限!')
        }
      } catch (err) {
        admin_resJson(ctx, {
          state: 'error',
          message: '当前用户无权限!'
        })
      }
    } else {
      if (role_id === config.SUPER_ROLE_ID) {
        // 超管直接拥有所有权限，设置无否都是拥有最高权限，超管只有一个，某些接口会判断，否则会报错
        await next()
      } else {
        admin_resJson(ctx, {
          state: 'error',
          message: '当前用户无任何操作权限'
        })
      }
    }
  }
}

module.exports = VerifyAuthority
