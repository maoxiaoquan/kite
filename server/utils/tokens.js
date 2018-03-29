const jwt = require('jsonwebtoken');
const de = require('./data_example')

class Tokens {
  constructor() { }
  async testToken(ctx, next) {

    let req = ctx.request.body
    let token = req.token || ctx.query.token || ctx.headers['x-access-token'];

    console.log('jwt', jwt)

    if (token) {
      //存在token，解析token
      jwt.verify(token, 'cxh', function (err, decoded) {
        if (err) {
          // 解析失败直接返回失败警告
          de.format_data(ctx, 2, 'token错误')
        } else {
          //解析成功加入请求信息，继续调用后面方法
          ctx.request.userInfo = decoded;
          next()
        }
      })
    } else {
      de.format_data(ctx, 3, '请登录')
    }
  }
  setToken(name, time, data) {
    var jwtSecret = name;
    var token = jwt.sign(data, jwtSecret, {
      expiresIn: time
    })
    return token;
  }
}
module.exports = new Tokens()