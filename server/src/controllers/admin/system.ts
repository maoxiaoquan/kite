const { resAdminJson } = require('../../utils/resData')
const lowdb = require('../../../../db/lowdb/index')
const path = require('path')
const fs = require('fs')
class System {
  /**
   * 获取标分页评论列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getSystemInfo(req: any, res: any, next: any) {
    try {
      const email = lowdb
        .read()
        .get('email')
        .value()
      const website = lowdb
        .read()
        .get('website')
        .value()
      const config = lowdb
        .read()
        .get('config')
        .value()
      const oauth = lowdb
        .read()
        .get('oauth')
        .value()
      const storage = lowdb
        .read()
        .get('storage')
        .value()

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          email: {
            ...email,
            pass: ''
          },
          website,
          config,
          oauth,
          storage
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
   * 更新系统配置
   * @param   {object} ctx 上下文对象
   */
  static async updateSystemInfo(req: any, res: any, next: any) {
    const { email, website, type, config, oauth, storage } = req.body
    try {
      if (type === 'email') {
        await lowdb
          .get('email')
          .assign(email)
          .write()
      } else if (type === 'website') {
        await lowdb
          .get('website')
          .assign(website)
          .write()
      } else if (type === 'config') {
        await lowdb
          .get('config')
          .assign(config)
          .write()
      } else if (type === 'oauth') {
        await lowdb
          .get('oauth')
          .assign(oauth)
          .write()
      } else if (type === 'storage') {
        await lowdb
          .get('storage')
          .assign(storage)
          .write()
      }

      resAdminJson(res, {
        state: 'success',
        message: '更新系统配置成功'
      })
    } catch (e) {
      resAdminJson(res, {
        state: 'error',
        message: '更新系统配置失败'
      })
    }
  }

  /**
   * 获取标分页评论列表操作
   * @param   {object} ctx 上下文对象
   */
  static async getSystemTheme(req: any, res: any, next: any) {
    try {
      let list: String[] = []

      const themeList: String[] = await new Promise((resolve, reject) => {
        return fs.readdir(
          path.resolve(__dirname, '../../../../static/theme/'),
          (err: any, filenames: any) => {
            if (err) {
              reject(err)
            } else {
              resolve(filenames)
            }
          }
        )
      })

      for (let i in themeList) {
        if (!~themeList[i].indexOf('.')) {
          list.push(themeList[i])
        }
      }

      resAdminJson(res, {
        state: 'success',
        message: '返回成功',
        data: {
          list
        }
      })
    } catch (err) {
      resAdminJson(res, {
        state: 'error',
        message: '错误信息：' + err
      })
      return false
    }
  }
}

export default System
