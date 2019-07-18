const jwt = require('jsonwebtoken')
const { client_resJson, admin_resJson } = require('./res_data')
const models = require('../../db/mysqldb')
class Tokens {
  static async ClientVerifyToken (ctx, next) {
    let req = ctx.request.body
    let token =
      req.accessToken ||
      ctx.query.accessToken ||
      ctx.headers['access-token'] ||
      ctx.cookies.get('accessToken')
    if (token) {
      // 存在token，解析token
      await jwt.verify(token, 'client', async (err, decoded) => {
        if (err) {
          await client_resJson(ctx, {
            state: 'error',
            message: '当前用户未登陆，请登陆后再次尝试',
            data: {
              islogin: false,
              user: {}
            }
          })
        } else {
          ctx.request.islogin = true
          ctx.request.user = await models.user.findOne({
            where: { uid: decoded.uid }
          })
          await next()
        }
      })
    } else {
      await client_resJson(ctx, {
        state: 'error',
        message: '当前用户未登陆，请登陆后再次尝试',
        data: {
          islogin: false,
          user: {}
        }
      })
    }
  }

  static async AdminVerifyToken (ctx, next) {
    let req = ctx.request.body
    let token = req.token || ctx.query.token || ctx.headers['x-access-token']

    if (token) {
      // 存在token，解析token
      try {
        ctx.request.userInfo = await jwt.verify(token, 'admin')
        await next()
      } catch (err) {
        admin_resJson(
          ctx,
          {
            state: 'error',
            message: '请登录'
          },
          false
        )
      }
    } else {
      admin_resJson(
        ctx,
        {
          state: 'error',
          message: '请登录'
        },
        false
      )
    }
  }

  static AdminSetToken (time, data) {
    return jwt.sign(data, 'admin', {
      expiresIn: time
    })
  }

  static ClientSetToken (time, data) {
    return jwt.sign(data, 'client', {
      expiresIn: time
    })
  }
}

module.exports = Tokens
