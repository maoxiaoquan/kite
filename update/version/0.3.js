const sequelize = require('../../db/mysqldb/init')
const models = require('../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../db/lowdb/index')
const CURRENT_VERSION = 0.3
class update0_3 {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)
        await models.dynamic.sync({
          force: true
        })
        await models.dynamic_topic.sync({
          force: true
        })
        await models.dynamic_comment.sync({
          force: true
        })
        await models.dynamic_like.sync({
          force: true
        })
        await models.rss_dynamic_topic.sync({
          force: true
        })
        console.log(`${CURRENT_VERSION}版本升级完成`)
        await lowdb
          .get('config')
          .assign({ version: CURRENT_VERSION })
          .write()
        resolve(`${CURRENT_VERSION}版本升级完成`)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = update0_3
