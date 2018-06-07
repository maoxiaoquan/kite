const jwt = require('jsonwebtoken')
const res_data = require('./res_data')

class Tokens {
  constructor() { }

  static async verifyToken(ctx, next) {

    let req = ctx.request.body
     let token = req.token || ctx.query.token || ctx.headers['x-access-token']


    if (token) {
      //存在token，解析token
      try {
        let jwt_data = await jwt.verify(token, 'cxh')
        ctx.request.userInfo = jwt_data
        await next()
      } catch (err) {
        res_data.format_data(ctx, {
          state: 'error',
          message: '登录超时'
        }, false)
      }

    } else {
      res_data.format_data(ctx, {
        state: 'error',
        message: '请登录'
      }, false)
    }

  }

  static setToken(name, time, data) {
    let jwtSecret = name
    let token = jwt.sign(data, jwtSecret, {
      expiresIn: time
    })
    return token
  }
}

module.exports = Tokens