const jwt = require('jsonwebtoken')
const res_data = require('./res_data')

class Tokens {
  constructor () { }

  async testToken (ctx, next) {

    let req = ctx.request.body
    let token = req.token || ctx.query.token || ctx.headers['x-access-token']

    if (token) {
      //存在token，解析token
      jwt.verify(token, 'cxh', function (err, decoded) {
        if (err) {
          // 解析失败直接返回失败警告
          res_data.format_data(ctx, {
            state: 'error',
            message: '登录已超时'
          }, false)
        } else {
          //解析成功加入请求信息，继续调用后面方法
          ctx.request.userInfo = decoded
          next()
        }
      })
    } else {
      res_data.format_data(ctx, {
        state: 'error',
        message: '请登录'
      }, false)
    }
  }

  setToken (name, time, data) {
    let jwtSecret = name
    let token = jwt.sign(data, jwtSecret, {
      expiresIn: time
    })
    return token
  }
}

module.exports = new Tokens()