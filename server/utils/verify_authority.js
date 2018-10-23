const { sign_resJson, admin_resJson } = require('../utils/res_data')
const {
  ad_role,
  ad_authority,
  ad_user_role,
  ad_role_authority
} = require('../../db/mysqldb')

function err_mess(message) {
  this.message = message
  this.name = 'UserException'
}

class VerifyAuthority {
  constructor() {}
  static async check(ctx, next) {
    const { url, userInfo = {} } = ctx.request
    const { role_id } = userInfo
    if (role_id) {
      /* 判断当前登录用户是否有角色，否则无任何权限 */
      try {
        let find_ad_authority = await ad_authority.findOne({
          where: { authority_url: url.split('/')[url.split('/').length - 1] }
        })
        if (find_ad_authority) {
          /* 查看权限列表中是否有此权限，没有则是直接通过 */
          let find_ad_role_authority = await ad_role_authority.findOne({
            where: {
              authority_id: find_ad_authority.authority_id,
              role_id: role_id
            }
          })
          if (find_ad_role_authority) {
            await next()
          } else {
            throw new err_mess('当前用户无权限!')
          }
        } else {
          await next()
        }
      } catch (err) {
        admin_resJson(ctx, {
          state: 'error',
          message: err.message
        })
      }
    } else {
      admin_resJson(ctx, {
        state: 'error',
        message: '当前用户无任何操作权限'
      })
    }
  }
}

module.exports = VerifyAuthority
