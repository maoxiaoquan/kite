const {render, home_resJson} = require('../../utils/cli_res_data')
const {lowdb} = require('../../../db/lowdb/index')
const Seq = require('sequelize')
const {
    checkUserName,
    checkPwd,
    checkEmail
} = require('../../utils/validators')
const {
    tools: {encrypt}
} = require('../../utils/index')

const config = require('../../../config')

function err_mess(message) {
    this.message = message
    this.name = 'UserException'
}

class Init {
    constructor() {
    }

    static async post_set_step(ctx) {
        let formData = ctx.request.body

        await lowdb
            .set('cli.step', formData.step) // 通过set方法来对对象操作
            .write()

        await home_resJson(ctx, {
            state: 'success',
            message: 'step update success'
        })
    }

    static async render_init(ctx) {
        await render(ctx, {
            title: 'init project',
            view_url: 'cli_default/init',
            state: 'success',
            message: 'home'
        })
    }

    static async render_init_step_one(ctx) {
        await render(ctx, {
            title: 'init project',
            view_url: 'cli_default/init_step_one',
            state: 'success',
            message: 'home'
        })
    }

    static async render_init_step_two(ctx) {
        await render(ctx, {
            title: 'init project',
            view_url: 'cli_default/init_step_two',
            state: 'success',
            message: 'home'
        })
    }

    static async render_init_step_three(ctx) {
        await render(ctx, {
            title: 'init project',
            view_url: 'cli_default/init_step_three',
            state: 'success',
            message: 'home'
        })
    }

    static async post_set_mysql(ctx) {
        // set mysql 数据
        let formData = ctx.request.body
        await lowdb.set('mysql', {...formData}).write()

        const config_mysql = lowdb
            .read()
            .get('mysql')
            .value()
        /*表字段*/

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

        const {sequelize} = require('../../../db/mysqldb/define')(init_sequelize)

        await sequelize
            .sync({force: true})
            .then(async () => {
                await home_resJson(ctx, {
                    state: 'success',
                    message: 'mysql table create success'
                })
            })
            .catch(async error => {
                await home_resJson(ctx, {state: 'error', message: error})
            })

        /* await init_sequelize
          .authenticate()
          .then(async () => {
            await home_resJson(ctx, {
              state: 'success',
              message: 'save mysql message success，mysql coonect link success'
            })
          })
          .catch(async error => {
            await home_resJson(ctx, {
              state: 'error',
              message: error
            })
          }) */
    }

    static async post_create_admin_user(ctx) {
        const req_data = ctx.request.body
        const config_mysql = lowdb
            .read()
            .get('mysql')
            .value()
        /*表字段*/

        try {
            if (!req_data.account) {
                throw new err_mess('请输入账户!')
            }
            if (!req_data.nickname) {
                throw new err_mess('请输入昵称!')
            }
            if (!checkUserName(req_data.account)) {
                throw new err_mess('账户须5-12个英文字符!')
            }
            if (!req_data.password) {
                throw new err_mess('请输入密码!')
            }
            if (!checkPwd(req_data.password)) {
                throw new err_mess('密码格式输入有误!')
            }

            /*  let admin_user_findOne = await Init_models.admin_user.findOne({
              where: { account: req_data.account }
            })

            if (admin_user_findOne) {
              throw new err_mess('账户已存在!')
            } */
        } catch (err) {
            home_resJson(ctx, {state: 'error', message: err.message})
            return false
        }

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

        const {
            sequelize,
            admin_user,
            admin_role,
            admin_user_role
        } = require('../../../db/mysqldb/define')(init_sequelize)

        await lowdb
            .set('email', {
                service: req_data.email_suffix,
                user: req_data.email,
                pass: req_data.email_password
            })
            .write()

        let create_admin_role = await admin_role.create({
            role_name: 'super admin',
            role_description: 'super admin'
        })

        let create_admin_user = await admin_user.create({
            account: req_data.account,
            avatar: 'http://oq33egsog.bkt.clouddn.com/avatar1.jpg',
            nickname: req_data.nickname,
            password: encrypt(req_data.password, config.encrypt_key),
            reg_ip: ctx.request.ip,
            enable: true
        })

        await admin_user_role
            .create({
                uid: create_admin_user.uid,
                role_id: create_admin_role.role_id
            })
            .then(async p => {
                await lowdb
                    .set('cli', {
                        is_success: true
                    })
                    .write()
                home_resJson(ctx, {state: 'success', message: '注册成功'})
            })
            .catch(err => {
                home_resJson(ctx, {state: 'error', message: '注册失败'})
            })
    }


    static async post_restart_project(ctx) { // 项目初始化成功后重启
        const shell = require('./shell')


        home_resJson(ctx, {
            state: 'error',
            data: shell.demo(),
            message: '注册失败'
        })
    }
}

module.exports = Init
