const models = require('../../../../../db/mysqldb/index')
import axios, { AxiosInstance } from 'axios'
const {
  checkEmail,
  checkPhoneNum,
  checkUrl,
  checkPwd
} = require('../../../utils/validators')
import moment from 'moment'
const { resClientJson } = require('../../../utils/resData')
const { sendVerifyCodeMail } = require('../../../utils/sendEmail')
const { random_number, tools } = require('../../../utils/index')
const config = require('../../../../../config')
const Op = require('sequelize').Op
const tokens = require('../../../utils/tokens')
const lowdb = require('../../../../../db/lowdb/index')
const clientWhere = require('../../../utils/clientWhere')

const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualType,
  virtualInfo,
  virtualPlusLess,
  modelType
} = require('../../../utils/constant')

import userVirtual from '../../../common/userVirtual'
import { user } from '../../../graphql/models'
const IS_DEV = process.env.NODE_ENV === 'development'

class Oauth {
  static async githubAuth(req: any, res: any, next: any) {
    const oauth = lowdb
      .read()
      .get('oauth')
      .value()
    const oauths = oauth.oauths || {}
    const oauthGithub = oauth.oauth_github || {}
    const { state } = req.query || ''
    const client_id = oauthGithub.client_id || ''
    const redirect_uri = IS_DEV
      ? 'http://localhost:8081/oauth/github'
      : oauthGithub.redirect_uri || ''
    const authUrl = 'https://github.com/login/oauth/authorize'
    let redirectUrl = state
      ? `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`
      : `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}`

    if (~oauths.indexOf('github')) {
      res.redirect(redirectUrl)
    } else {
      res.redirect('/')
    }
  }

  static async githubLoginAuth(req: any, res: any, next: any) {
    const oauth = lowdb
      .read()
      .get('oauth')
      .value()
    const oauths = oauth.oauths || {}
    const oauthGithub = oauth.oauth_github || {}
    const { code, state } = req.query || ''
    const { islogin = '', user } = req
    const client_id = oauthGithub.client_id || ''
    const client_secret = oauthGithub.client_secret || ''
    const redirect_uri = IS_DEV
      ? 'http://localhost:8081/oauth/github'
      : oauthGithub.redirect_uri || ''
    const accessTokenUrl = 'https://github.com/login/oauth/access_token'
    try {
      if (!~oauths.indexOf('github')) {
        throw new Error('github第三方登录未开启')
      }

      const githubToken = await axios.post(accessTokenUrl, {
        client_id,
        client_secret,
        code,
        redirect_uri
      })

      const orGithubInfo = await axios.get(
        `https://api.github.com/user?${githubToken.data}`
      )
      const githubInfo = orGithubInfo.data

      const userAuthInfo = await models.user_auth.findOne({
        where: {
          identifier: githubInfo.login,
          identity_type: 'github'
        }
      })

      if (!userAuthInfo) {
        // 通过userAuthInfo字段来判断是登录还是绑定or创建
        if (state) {
          // 通过state字段来判断是绑定or创建
          // 当前绑定
          if (!islogin) {
            throw new Error('当前未登录绑定失败')
          }

          if (state !== user.uid) {
            throw new Error('绑定失败，账户出现意外错误')
          }
          await models.user_auth.create({
            /* 注册写入数据库操作 */
            uid: state,
            identity_type: 'github',
            identifier: githubInfo.login,
            credential: githubInfo.login,
            verified: true
          })
          res.json({
            state: 'success',
            data: {
              type: 'bind'
            },
            message: '绑定成功'
          })
        } else {
          // 当前创建
          let user = await models.user.findOne({
            where: {
              email: githubInfo.email
            }
          })
          if (user) {
            throw new Error('github授权登录失败，当前github邮箱已在平台注册')
          }

          const userCreate = await models.user.create({
            /* 注册写入数据库操作 */
            avatar: config.default_avatar,
            username: githubInfo.login,
            nickname: githubInfo.name,
            password: tools.encrypt('q123456', config.ENCRYPT_KEY),
            email: githubInfo.email,
            user_role_ids: config.USER_ROLE.dfId,
            sex: 0,
            reg_ip: req.ip,
            enable: true
          })

          await models.sequelize.transaction((t: any) => {
            // 在事务中执行操作
            return models.user_info
              .create(
                {
                  /* 注册写入数据库操作 */
                  uid: userCreate.uid,
                  avatar_review_status: 2,
                  shell_balance:
                    virtualInfo[modelAction.registered][virtualType.system]
                },
                { transaction: t }
              )
              .then((user_info: any) => {
                return models.user_auth.create(
                  {
                    /* 注册写入数据库操作 */
                    uid: user_info.uid,
                    identity_type: 'github',
                    identifier: githubInfo.login,
                    credential: githubInfo.login,
                    verified: true
                  },
                  { transaction: t }
                )
              })
              .then((user_auth: any) => {
                return models.virtual.create({
                  // 用户虚拟币消息记录
                  plus_less: virtualInfo[modelAction.registered].plusLess,
                  balance:
                    virtualInfo[modelAction.registered][virtualType.system],
                  amount:
                    virtualInfo[modelAction.registered][virtualType.system],
                  income:
                    virtualInfo[modelAction.registered][virtualType.system],
                  expenses: 0,
                  uid: user_auth.uid,
                  type: virtualType.system,
                  action: modelAction.registered
                })
              })
          })

          let loginToken = tokens.ClientSetToken(60 * 60 * 24 * 7, {
            uid: userCreate.uid
          })
          res.json({
            state: 'success',
            data: {
              type: 'create',
              token: loginToken,
              user: userCreate,
              password: 'q123456'
            },
            message: '登录成功'
          })
        }
      } else {
        if (state) {
          // 通过state字段来判断是绑定or创建
          // 当前绑定
          throw new Error('请勿重复绑定')
        }
        let loginToken = tokens.ClientSetToken(60 * 60 * 24 * 7, {
          uid: userAuthInfo.uid
        })
        res.json({
          state: 'success',
          data: {
            type: 'login',
            token: loginToken
          },
          message: '登录成功'
        })
      }
    } catch (error) {
      res.json({
        state: 'error',
        message: error.message
      })
    }
  }

  static async githubDeleteAuth(req: any, res: any, next: any) {
    try {
      const { identity_type = '' } = req.body
      const { user } = req
      await models.user_auth.destroy({
        where: { uid: user.uid, identity_type }
      })
      resClientJson(res, {
        state: 'success',
        message: '解除绑定成功'
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

export default Oauth
