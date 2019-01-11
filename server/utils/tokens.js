const jwt = require('jsonwebtoken')
const resData = require('./res_data')

class Tokens {
  constructor () { }

  static async ClientVerifyToken (ctx, next) {
    let req = ctx.request.body
    let token = req.accessToken || ctx.query.accessToken || ctx.headers['access-token'] || ctx.cookies.get('accessToken')
    if (token) {
      // 存在token，解析token
      await jwt.verify(token, 'client', async (err, decoded) => {
        if (err) {
          await resData.home_resJson(ctx, {
            state: 'error',
            message: '当前用户未登陆',
            data: {
              islogin: false
            }
          })
        } else {
          ctx.request.islogin = true
          ctx.request.user = decoded
          await next()
        }
      })
    } else {
      await resData.home_resJson(ctx, {
        state: 'error',
        message: '当前用户未登陆',
        data: {
          islogin: false
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
        let jwt_data = await jwt.verify(token, 'admin')
        ctx.request.userInfo = jwt_data
        await next()
      } catch (err) {
        resData.admin_resJson(ctx, {
          state: 'error',
          message: '登录超时'
        }, false)
      }
    } else {
      resData.admin_resJson(ctx, {
        state: 'error',
        message: '请登录'
      }, false)
    }
  }

  static AdminSetToken (time, data) {
    let token = jwt.sign(data, 'admin', {
      expiresIn: time
    })
    return token
  }

  static ClientSetToken (time, data) {
    let token = jwt.sign(data, 'client', {
      expiresIn: time
    })
    return token
  }
}

module.exports = Tokens
