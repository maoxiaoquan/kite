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
    const client_id = '0552fa82218b2a7a45ae'
    const redirect_uri =
      'http://localhost:8081/api-client/v1/oauth/github-login-oauth'
    const authUrl = 'https://github.com/login/oauth/authorize'
    let redirectUrl = `${authUrl}?client_id=${client_id}&redirect_uri=${redirect_uri}`

    res.redirect(redirectUrl)
  }

  static async githubLoginAuth(req: any, res: any, next: any) {
    const code = req.query.code || ''
    const client_id = '0552fa82218b2a7a45ae'
    const client_secret = 'e8d7662dac58a8e9cca01904a66e25bd6e4177b2'
    const redirect_uri =
      'http://localhost:8081/api-client/v1/oauth/github-login-oauth'
    const accessTokenUrl = 'https://github.com/login/oauth/access_token'
    try {

      const token = await axios
        .post(accessTokenUrl, {
          client_id: client_id,
          client_secret: client_secret,
          code: code,
          redirect_uri: redirect_uri
        })

      const orGithubInfo = await axios.get(`https://api.github.com/user?${token.data}`)
      const githubInfo = orGithubInfo.data
      console.log('githubInfo', githubInfo)
      const userCreate = await models.sequelize.transaction((t: any) => {
        // 在事务中执行操作
        return models.user
          .create(
            {
              /* 注册写入数据库操作 */
              avatar: config.default_avatar,
              username: githubInfo.login,
              nickname: githubInfo.name,
              password: tools.encrypt('11', config.ENCRYPT_KEY),
              email: githubInfo.email,
              user_role_ids: config.USER_ROLE.dfId,
              sex: 0,
              reg_ip: req.ip,
              enable: true
            },
            { transaction: t }
          )
          .then((user: any) => {
            return models.user_info.create(
              {
                /* 注册写入数据库操作 */
                uid: user.uid,
                avatar_review_status: 2,
                shell_balance:
                  virtualInfo[modelAction.registered][virtualType.system]
              },
              { transaction: t }
            )
          })
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

      console.log('userCreate', userCreate)

      res.redirect('http://localhost:8081')
    } catch (error) {
      console.log('error', error)
      res.redirect('http://localhost:8081/404')
    }
  }
}

export default Oauth
