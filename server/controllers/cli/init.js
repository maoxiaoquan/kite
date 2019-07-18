const { render, client_resJson } = require('../../utils/cli_res_data')
const { lowdb } = require('../../../db/lowdb/index')
const Seq = require('sequelize')
const admin_authority_list = require('../../libs/admin_authority_list')
const user_authority_list = require('../../libs/user_authority_list')
const admin_role_list = require('../../libs/admin_role_list')
const user_role_list = require('../../libs/user_role_list')

const default_article_column_list = require('../../libs/default_article_column_list')
const default_article_tag_list = require('../../libs/default_article_tag_list')
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
  static async post_set_step (ctx) {
    let formData = ctx.request.body

    await lowdb
      .set('cli.step', formData.step) // 通过set方法来对对象操作
      .write()

    await client_resJson(ctx, {
      state: 'success',
      message: 'step update success'
    })
  }

  static async render_init (ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: '_cli/init',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_one (ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: '_cli/init_step_one',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_two (ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: '_cli/init_step_two',
      state: 'success',
      message: 'home'
    })
  }

  static async render_init_step_three (ctx) {
    await render(ctx, {
      title: 'init project',
      view_url: '_cli/init_step_three',
      state: 'success',
      message: 'home'
    })
  }

  static async post_set_mysql (ctx) {
    // set mysql 数据
    let formData = ctx.request.body

    try {
      await lowdb.set('mysql', { ...formData }).write()

      const config_mysql = lowdb
        .read()
        .get('mysql')
        .value()
      /* 表字段 */

      const init_sequelize = new Seq(
        config_mysql.database, // 数据库名
        config_mysql.username, // 用户名
        config_mysql.password, // 用户密码
        {
          dialect: 'mysql', // 数据库使用mysql
          host: config_mysql.host, // 数据库服务器ip
          port: config_mysql.mysql_port, // 数据库服务器端口
          define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            underscored: true
          }
        }
      )

      const { sequelize } = require('../../../db/mysqldb/define')(
        init_sequelize
      )

      await sequelize.sync({ force: true })

      await client_resJson(ctx, {
        state: 'success',
        message: 'mysql table create success'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async post_create_admin_user (ctx) {
    const req_data = ctx.request.body
    const config_mysql = lowdb
      .read()
      .get('mysql')
      .value()
    /* 表字段 */

    try {
      if (!req_data.account) {
        throw new ErrorMessage('请输入账户!')
      }
      if (!req_data.nickname) {
        throw new ErrorMessage('请输入昵称!')
      }
      if (!checkUserName(req_data.account)) {
        throw new ErrorMessage('账户须5-22个英文字符!')
      }
      if (!req_data.password) {
        throw new ErrorMessage('请输入密码!')
      }
      if (!checkPwd(req_data.password)) {
        throw new ErrorMessage(
          '密码格式输入有误，格式为字母与数字的组合，长度最小为6个字符!'
        )
      }

      if (!req_data.email_type) {
        throw new ErrorMessage('请选择邮箱类型')
      }

      if (!req_data.email) {
        throw new ErrorMessage('请填写邮箱地址!')
      }

      if (!checkEmail(req_data.email)) {
        throw new ErrorMessage('邮箱格式输入有误')
      }

      if (!req_data.email_password) {
        throw new ErrorMessage('请填写邮箱密码!')
      }

      if (req_data.email_type === 'company') {
        if (!req_data.email_host) {
          throw new ErrorMessage('请填写邮箱服务器地址!')
        }
        if (!req_data.email_port) {
          throw new ErrorMessage('请填写邮箱端口')
        }
      }

      if (!req_data.admin_url) {
        throw new ErrorMessage('请填写后台管理访问地址!')
      }

      const init_sequelize = new Seq(
        config_mysql.database, // 数据库名
        config_mysql.username, // 用户名
        config_mysql.password, // 用户密码
        {
          dialect: 'mysql', // 数据库使用mysql
          dialectOptions: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            supportBigNumbers: true,
            bigNumberStrings: true
          },
          host: config_mysql.host, // 数据库服务器ip
          port: config_mysql.mysql_port, // 数据库服务器端口
          timezone: '+8:00', // 设置东八区
          define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            underscored: true
          }
        }
      )

      const {
        admin_user,
        admin_role,
        admin_authority,
        user_authority,
        user_role,
        article_tag,
        article_column
      } = require('../../../db/mysqldb/define')(init_sequelize)

      await lowdb
        .set('email', {
          service: req_data.email_suffix || '',
          type: req_data.email_type || '',
          host: req_data.email_host || '',
          port: req_data.email_port || '',
          user: req_data.email || '',
          pass: req_data.email_password || ''
        })
        .set('website', {
          website_name: req_data.website_name || '',
          domain_name: req_data.domain_name || '',
          keywords: req_data.keywords || '',
          introduction: req_data.introduction || '',
          description: req_data.description || ''
        })
        .set('config', {
          admin_url: req_data.admin_url || 'admin',
          on_register: req_data.on_register,
          on_login: req_data.on_login,
          on_comment: req_data.on_comment,
          version: kiteConfig.version
        })
        .write()

      await admin_authority.bulkCreate(admin_authority_list) // 导入默认后台管理员角色权限列表
      await user_authority.bulkCreate(user_authority_list) // 导入默认用户角色权限列表
      await admin_role.bulkCreate(admin_role_list)
      await user_role.bulkCreate(user_role_list)
      await article_tag.bulkCreate(default_article_tag_list)
      await article_column.bulkCreate(default_article_column_list)

      await admin_user.create({
        // 创建默认超管角色
        account: req_data.account,
        avatar: config.default_avatar,
        nickname: req_data.nickname,
        password: encrypt(req_data.password, config.encrypt_key),
        admin_role_ids: config.SUPER_ROLE_ID,
        // reg_ip: ctx.request.ip,
        enable: true
      })

      await lowdb
        .get('cli')
        .assign({
          is_success: true
        })
        .write()

      await client_resJson(ctx, {
        state: 'success',
        message: '注册成功'
      })
    } catch (err) {
      client_resJson(ctx, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }

  static async post_restart_project (ctx) {
    // 项目初始化成功后重启
    const shell = require('./shell')
    shell.esc()
  }
}

module.exports = Init
