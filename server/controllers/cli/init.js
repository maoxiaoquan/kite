const { render, resClientJson } = require('../../utils/cliResData')
const { lowdb } = require('../../../db/lowdb/index')
const Seq = require('sequelize')
const dfAdminAuthorityList = require('../../libs/dfAdminAuthorityList')
const dfUserAuthorityList = require('../../libs/dfUserAuthorityList')
const dfAdminRoleList = require('../../libs/dfAdminRoleList')
const dfUserRoleList = require('../../libs/dfUserRoleList')

const dfArticleColumnList = require('../../libs/dfArticleColumnList')
const dfArticleTagList = require('../../libs/dfArticleTagList')
const dfDynamicTopicList = require('../../libs/dfDynamicTopicList')

const {
  checkUserName,
  checkPwd,
  checkEmail
} = require('../../utils/validators')
const {
  tools: { encrypt }
} = require('../../utils/index')

const config = require('../../config')
const kiteConfig = require('../../../kite.config')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Init {
  static async cliSetStep (req, res, next) {
    let formData = req.body

    console.log('formData', formData)

    await lowdb
      .set('cli.step', formData.step) // 通过set方法来对对象操作
      .write()

    res.json({
      state: 'success',
      message: 'step update success'
    })
  }

  static async cliInit (req, res, next) {
    console.log(11111111111111)
    await render(res, {
      title: 'init project',
      view_url: '_cli/init',
      state: 'success',
      message: 'home'
    })
  }

  static async cliInitStepOne (req, res, next) {
    await render(res, {
      title: 'init project',
      view_url: '_cli/init_step_one',
      state: 'success',
      message: 'home'
    })
  }

  static async cliInitStepTwo (req, res, next) {
    await render(res, {
      title: 'init project',
      view_url: '_cli/init_step_two',
      state: 'success',
      message: 'home'
    })
  }

  static async cliInitStepThree (req, res, next) {
    await render(res, {
      title: 'init project',
      view_url: '_cli/init_step_three',
      state: 'success',
      message: 'home'
    })
  }

  static async cliSetMysql (req, res, next) {
    // set mysql 数据
    let formData = req.body

    try {
      await lowdb.set('mysql', { ...formData }).write()

      const configMysql = lowdb
        .read()
        .get('mysql')
        .value()
      /* 表字段 */

      const initSequelize = new Seq(
        configMysql.database, // 数据库名
        configMysql.username, // 用户名
        configMysql.password, // 用户密码
        {
          dialect: 'mysql', // 数据库使用mysql
          host: configMysql.host, // 数据库服务器ip
          port: configMysql.mysql_port, // 数据库服务器端口
          define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            underscored: true
          }
        }
      )

      const { sequelize } = require('../../../db/mysqldb/define')(initSequelize)

      await sequelize.sync({ force: true })
      console.log(111111111188)
      res.json({
        state: 'success',
        message: 'mysql table create success'
      })
    } catch (err) {
      res.json({
        state: 'error',
        message: '错误信息：' + err.message
      })

      return false
    }
  }

  static async cliCreateAdminUser (req, res, next) {
    const reqData = req.body
    const configMysql = lowdb
      .read()
      .get('mysql')
      .value()
    /* 表字段 */

    try {
      if (!reqData.account) {
        throw new ErrorMessage('请输入账户!')
      }
      if (!reqData.nickname) {
        throw new ErrorMessage('请输入昵称!')
      }
      if (!checkUserName(reqData.account)) {
        throw new ErrorMessage('账户须5-22个英文字符!')
      }
      if (!reqData.password) {
        throw new ErrorMessage('请输入密码!')
      }
      if (!checkPwd(reqData.password)) {
        throw new ErrorMessage(
          '密码格式输入有误，格式为字母与数字的组合，长度最小为6个字符!'
        )
      }

      if (!reqData.email_type) {
        throw new ErrorMessage('请选择邮箱类型')
      }

      if (!reqData.email) {
        throw new ErrorMessage('请填写邮箱地址!')
      }

      if (!checkEmail(reqData.email)) {
        throw new ErrorMessage('邮箱格式输入有误')
      }

      if (!reqData.email_password) {
        throw new ErrorMessage('请填写邮箱密码!')
      }

      if (reqData.email_type === 'company') {
        if (!reqData.email_host) {
          throw new ErrorMessage('请填写邮箱服务器地址!')
        }
        if (!reqData.email_port) {
          throw new ErrorMessage('请填写邮箱端口')
        }
      }

      if (!reqData.admin_url) {
        throw new ErrorMessage('请填写后台管理访问地址!')
      }

      const initSequelize = new Seq(
        configMysql.database, // 数据库名
        configMysql.username, // 用户名
        configMysql.password, // 用户密码
        {
          dialect: 'mysql', // 数据库使用mysql
          dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            supportBigNumbers: true,
            bigNumberStrings: true
          },
          host: configMysql.host, // 数据库服务器ip
          port: configMysql.mysql_port, // 数据库服务器端口
          timezone: '+8:00', // 设置东八区
          define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            underscored: true
          }
        }
      )

      const models = require('../../../db/mysqldb/define')(initSequelize)

      await lowdb
        .set('email', {
          service: reqData.email_suffix || '',
          type: reqData.email_type || '',
          host: reqData.email_host || '',
          port: reqData.email_port || '',
          user: reqData.email || '',
          pass: reqData.email_password || ''
        })
        .set('website', {
          website_name: reqData.website_name || '',
          domain_name: reqData.domain_name || '',
          keywords: reqData.keywords || '',
          introduction: reqData.introduction || '',
          description: reqData.description || ''
        })
        .set('config', {
          admin_url: reqData.admin_url || 'admin',
          on_register: reqData.on_register,
          on_login: reqData.on_login,
          on_comment: reqData.on_comment,
          version: kiteConfig.version
        })
        .write()

      await models.admin_authority.bulkCreate(dfAdminAuthorityList) // 导入默认后台管理员角色权限列表
      await models.user_authority.bulkCreate(dfUserAuthorityList) // 导入默认用户角色权限列表
      await models.admin_role.bulkCreate(dfAdminRoleList)
      await models.user_role.bulkCreate(dfUserRoleList)
      await models.article_tag.bulkCreate(dfArticleTagList)
      await models.article_column.bulkCreate(dfArticleColumnList)
      await models.dynamic_topic.bulkCreate(dfDynamicTopicList)

      await models.admin_user.create({
        // 创建默认超管角色
        account: reqData.account,
        avatar: config.default_avatar,
        nickname: reqData.nickname,
        password: encrypt(reqData.password, config.ENCRYPT_KEY),
        admin_role_ids: config.SUPER_ROLE_ID,
        // reg_ip: req.ip,
        enable: true
      })

      await lowdb
        .get('cli')
        .assign({
          is_success: true
        })
        .write()

      res.json({
        state: 'success',
        message: '注册成功'
      })
    } catch (err) {
      res.json({
        state: 'error',
        message: '错误信息：' + err.message
      })

      return false
    }
  }

  static async cliRestartProject (req, res, next) {
    // 项目初始化成功后重启
    const shell = require('./shell')
    shell.esc()
  }
}

module.exports = Init
