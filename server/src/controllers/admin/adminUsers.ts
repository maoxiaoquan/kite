const { resSignJson, resAdminJson } = require('../../utils/resData')
const tokens = require('../../utils/tokens')
const {
  checkUserName,
  checkPwd,
  checkEmail
} = require('../../utils/validators')
const {
  tools: { encrypt }
} = require('../../utils/index')
const config = require('../../../../config')
const models = require('../../../../db/mysqldb/index')
import moment from 'moment'
import adminSystemLog from './adminSystemLog'
const Op = require('sequelize').Op
const lowdb = require('../../../../db/lowdb/index')

class AdminUsers {
  /**
   * 登录操作
   * @param  {object} ctx 上下文对象
   */
  static async adminSignIn(req: any, res: any, next: any) {
    let { account, password } = req.body
    try {
      const oneAdminUser = await models.admin_user.findOne({
        where: { account }
      })
      if (!account) {
        throw new Error('请输入账户!')
      }
      if (!checkUserName(account)) {
        throw new Error('5-22个英文字符!')
      }
      if (!password) {
        throw new Error('请输入密码!')
      }

      if (!oneAdminUser) {
        throw new Error('用户不存在!')
      }
      if (!(encrypt(password, config.ENCRYPT_KEY) === oneAdminUser.password)) {
        throw new Error('密码错误!')
      }
      if (!oneAdminUser.enable) {
        throw new Error('您已被限制登录!')
      }

      let datas = {
        uid: oneAdminUser.uid,
        account,
        role_id: oneAdminUser ? oneAdminUser.admin_role_ids : ''
      }
      let token = tokens.AdminSetToken(60 * 60 * 24 * 7, datas)
      resSignJson(res, {
        state: 'success',
        message: '登录成功',
        data: {
          token
        }
      })
    } catch (err) {
      resSignJson(res,
        {
          state: 'error',
          message: '错误信息：' + err.message
        })
    }
  }

  /**
   * 注册操作
   * @param   {object} ctx 上下文对象
   */
  static async createAdminUser(req: any, res: any, next: any) {
    const reqData = req.body

    try {
      if (!reqData.account) {
        throw new Error('请输入账户!')
      }
      if (!reqData.nickname) {
        throw new Error('请输入昵称!')
      }
      if (!checkUserName(reqData.account)) {
        throw new Error('账户须5-22个英文字符!')
      }
      if (!reqData.password) {
        throw new Error('请输入密码!')
      }
      if (!checkPwd(reqData.password)) {
        throw new Error('密码格式输入有误!')
      }
      if (!checkEmail(reqData.email)) {
        throw new Error('邮箱格式输入有误!')
      }
      let oneAdminUser = await models.admin_user.findOne({
        where: { account: reqData.account }
      })

      if (oneAdminUser) {
        throw new Error('账户已存在!')
      }

      await models.admin_user.create({
        account: reqData.account,
        avatar: config.default_avatar,
        nickname: reqData.nickname,
        password: encrypt(reqData.password, config.ENCRYPT_KEY),
        email: reqData.email,
        phone: reqData.phone,
        reg_time: moment()
          .utc()
          .utcOffset(+8)
          .format('X'),
        reg_ip: req.ip,
        enable: reqData.enable || false
      })
      await resAdminJson(res, {
        state: 'success',
        message: '注册成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 更新管理员用户
   * @param   {object} ctx 上下文对象
   */
  static async editAdminUser(req: any, res: any, next: any) {
    const reqData = req.body
    try {
      await models.admin_user.update(
        {
          account: reqData.account,
          nickname: reqData.nickname,
          password: encrypt(reqData.password, config.ENCRYPT_KEY),
          email: reqData.email,
          phone: reqData.phone,
          enable: reqData.enable || false
        },
        {
          where: {
            uid: reqData.uid // 查询条件
          }
        }
      )
      resAdminJson(res, {
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取用户列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getAdminUserList(req: any, res: any, next: any) {
    const { page = 1, pageSize = 10 } = req.query
    try {
      let { count, rows } = await models.admin_user.findAndCountAll({
        attributes: [
          'uid',
          'account',
          'nickname',
          'email',
          'phone',
          'last_sign_time',
          'reg_ip',
          'enable',
          'admin_role_ids'
        ],
        where: '', // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * Number(pageSize), // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: Number(pageSize) // 每页限制返回的数据条数
      })
      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          count: count,
          admin_user_list: rows
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  /**
   * 获取后台用户信息
   * @param   {object} ctx 上下文对象
   */
  static async getAdminUserInfo(req: any, res: any, next: any) {
    const { userInfo = {} } = req
    try {
      const { role_id } = userInfo
      let whereParmams: any = { authority_type: '1' }

      const website = lowdb
        .read()
        .get('website')
        .value()

      let oneAdminRole = await models.admin_role.findOne({
        where: {
          role_id
        }
      })
      role_id !== config.SUPER_ROLE_ID &&
        (whereParmams['authority_id'] = {
          [Op.in]: oneAdminRole.admin_authority_ids.split(',')
        })
      let AllAuthorityName = await models.admin_authority.findAll({
        where: whereParmams
      })

      let allAuthorityNameId = []
      for (let i in AllAuthorityName) {
        allAuthorityNameId.push(AllAuthorityName[i].authority_url)
      }

      let oneAdminUser = await models.admin_user.findOne({
        attributes: [
          'uid',
          'avatar',
          'account',
          'nickname',
          'email',
          'phone',
          'last_sign_time',
          'reg_ip',
          'enable'
        ],
        where: {
          uid: userInfo.uid
        }
      })

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          admin_user_info: oneAdminUser,
          all_authority_name_id: allAuthorityNameId,
          website
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }

  /**
   * 删除用户
   * @param   {object} ctx 上下文对象
   * 删除用户先判断管理员角色表中是否有关联，
   * 无关联则直接管理员删除，有关联则开启事务同时删除管理员角色关联表中关联
   * 管理员对角色是一对一的关系
   */
  static async deleteAdminUser(req: any, res: any, next: any) {
    const { uid } = req.body
    /* 无关联 */
    try {
      await models.admin_user.destroy({ where: { uid } })
      await adminSystemLog.createAdminSystemLog({
        // 写入日志
        uid: req.userInfo.uid,
        type: 3,
        content: `成功删了了id为‘${uid}’的管理员`
      })

      resAdminJson(res, {
        state: 'success',
        message: '删除管理员用户成功'
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: err.message
      })
      return false
    }
  }
}

export default AdminUsers
