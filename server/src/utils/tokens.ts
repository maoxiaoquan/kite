const jwt = require('jsonwebtoken')
const resData = require('./resData')
const _models = require('../../../db/mysqldb')

class Tokens {
  static async ClientVerifyToken(req: any, res: any, next: any) {
    let reqBody = req.body
    let token =
      reqBody.accessToken ||
      req.query.accessToken ||
      req.headers['access-token'] ||
      req.cookies.accessToken
    if (token) {
      // 存在token，解析token
      await jwt.verify(token, 'client', async (err: any, decoded: any) => {
        if (err) {
          await resData.resClientJson(res, {
            state: 'error',
            message: '当前用户未登陆，请登陆后再次尝试',
            data: {
              islogin: false,
              user: {}
            }
          })
        } else {
          let userInfo = await _models.user.findOne({
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
      await resData.resClientJson(res, {
        state: 'error',
        message: '当前用户未登陆，请登陆后再次尝试',
        data: {
          islogin: false,
          user: {}
        }
      })
    }
  }

  static async ClientVerifyTokenInfo(req: any, res: any, next: any) {
    let token =
      req.body.accessToken ||
      req.query.accessToken ||
      req.headers['access-token'] ||
      req.cookies.accessToken
    // 存在token，解析token
    await jwt.verify(token, 'client', async (err: any, decoded: any) => {
      if (err) {
        req.islogin = false
        req.user = {}
      } else {
        let userInfo = await _models.user.findOne({
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

  static async AdminVerifyToken(req: any, res: any, next: any) {
    let reqBody = req.body
    let token =
      reqBody.token || req.query.token || req.headers['x-access-token']

    if (token) {
      // 存在token，解析token
      try {
        req.userInfo = await jwt.verify(token, 'admin')
        await next()
      } catch (err) {
        resData.resAdminJson(
          res,
          {
            state: 'nologin',
            message: '请登录'
          },
          false
        )
      }
    } else {
      resData.resAdminJson(
        res,
        {
          state: 'nologin',
          message: '请登录'
        },
        false
      )
    }
  }

  static AdminSetToken(time: any, data: any) {
    return jwt.sign(data, 'admin', {
      expiresIn: time
    })
  }

  static ClientSetToken(time: any, data: any) {
    return jwt.sign(data, 'client', {
      expiresIn: time
    })
  }
}

module.exports = Tokens
