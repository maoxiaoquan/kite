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
  articleType,
  userMessageAction,
  userMessageActionText,
  modelAction,
  virtualType,
  virtualInfo,
  virtualPlusLess,
  modelType
} = require('../../../utils/constant')

import userVirtual from '../../../common/userVirtual'

class Oauth {
  static async githubAuth(req: any, res: any, next: any) {
    const { state } = req.query || ''
    const client_id = '0552fa82218b2a7a45ae'
    const redirect_uri = 'http://localhost:8081/oauth/github'
    const authUrl = 'https://github.com/login/oauth/authorize'
    let redirectUrl = state
      ? `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`
      : `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}`

    res.redirect(redirectUrl)
  }

  static async githubLoginAuth(req: any, res: any, next: any) {
    const { code, state } = req.query || ''
    const { islogin = '' } = req
    const client_id = '0552fa82218b2a7a45ae'
    const client_secret = 'e8d7662dac58a8e9cca01904a66e25bd6e4177b2'
    const redirect_uri = 'http://localhost:8081/oauth/github'
    const accessTokenUrl = 'https://github.com/login/oauth/access_token'
    try {
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
        identifier: githubInfo.login,
        identity_type: 'github'
      })
      if (!userAuthInfo) {
        // 通过userAuthInfo字段来判断是登录还是绑定or创建
        if (state) {
          // 通过state字段来判断是绑定or创建
          // 当前绑定
          if (!islogin) {
            throw new Error('当前未登录绑定失败')
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
            email: githubInfo.email
          })
          if (user) {
            throw new Error(
              'github授权登录失败，当前github邮箱已在平台注册，请登录后直接绑定即可'
            )
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
}

export default Oauth
