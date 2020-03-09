const models = require('../../../../db/mysqldb/index')
const { resClientJson } = require('../../utils/resData')
const lowdb = require('../../../../db/lowdb/index')

class Website {
  /**
   * 获取所有文章标签get
   * @param   {object} ctx 上下文对象
   */
  static async getWebsiteInfo(req: any, res: any, next: any) {
    try {
      const website = lowdb
        .read()
        .get('website')
        .value()
      const {
        on_login,
        on_register,
        on_comment,
        googleCode,
        isBaiduAuthPush
      } = lowdb
        .read()
        .get('config')
        .value()
      const oauth = lowdb
        .read()
        .get('oauth')
        .value()
      const oauths = oauth.oauths || []
      const noticeAll = await models.options.findAll({
        where: {
          option_key: 'notice' // 查询条件
        }
      })
      const advertiseAll = await models.options.findAll({
        where: {
          option_key: 'advertise' // 查询条件
        }
      })
      resClientJson(res, {
        state: 'success',
        message: '获取网站信息成功',
        data: {
          website,
          config: {
            on_login,
            on_register,
            on_comment,
            googleCode,
            isBaiduAuthPush
          },
          notice: noticeAll,
          advertise: advertiseAll,
          oauths
        }
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

export default Website
