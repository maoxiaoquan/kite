const jwt = require('jsonwebtoken')
const { resClientJson, resAdminJson } = require('./resData')
const models = require('../../db/mysqldb')
class Tokens {
  static async ClientVerifyToken(req, res, next) {
    let reqBody = req.body
    let token =
      reqBody.accessToken ||
      req.query.accessToken ||
      req.headers['access-token'] ||
      req.cookies.accessToken
    if (token) {
      // 存在token，解析token
      await jwt.verify(token, 'client', async (err, decoded) => {
        if (err) {
          await resClientJson(res, {
            state: 'error',
            message: '当前用户未登陆，请登陆后再次尝试',
            data: {
              islogin: false,
              user: {}
            }
          })
        } else {
          let userInfo = await models.user.findOne({
            where: { uid: decoded.uid }
          })
          if (userInfo) {
            req.islogin = true
            req.user = userInfo
          } else {
            req.islogin = false
            req.user = {}
          }
          await next()
        }
      })
    } else {
      await resClientJson(res, {
        state: 'error',
        message: '当前用户未登陆，请登陆后再次尝试',
        data: {
          islogin: false,
          user: {}
        }
      })
    }
  }

  static async ClientVerifyTokenInfo(req, res, next) {
    let token =
      req.body.accessToken ||
      req.query.accessToken ||
      req.headers['access-token'] ||
      req.cookies.accessToken
    // 存在token，解析token
    await jwt.verify(token, 'client', async (err, decoded) => {
      if (err) {
        req.islogin = false
        req.user = {}
      } else {
        let userInfo = await models.user.findOne({
          where: { uid: decoded.uid }
        })
        if (userInfo) {
          req.islogin = true
          req.user = userInfo
        } else {
          req.islogin = false
          req.user = {}
        }
      }
      await next()
    })
  }

  static async AdminVerifyToken(req, res, next) {
    let reqBody = req.body
    let token =
      reqBody.token || req.query.token || req.headers['x-access-token']

    if (token) {
      // 存在token，解析token
      try {
        req.userInfo = await jwt.verify(token, 'admin')
        await next()
      } catch (err) {
        resAdminJson(
          res,
          {
            state: 'error',
            message: '请登录'
          },
          false
        )
      }
    } else {
      resAdminJson(
        res,
        {
          state: 'error',
          message: '请登录'
        },
        false
      )
    }
  }

  static AdminSetToken(time, data) {
    return jwt.sign(data, 'admin', {
      expiresIn: time
    })
  }

  static ClientSetToken(time, data) {
    return jwt.sign(data, 'client', {
      expiresIn: time
    })
  }
}

module.exports = Tokens
