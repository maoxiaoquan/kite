const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
const CURRENT_VERSION = 0.8
let step = 0
class update {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)
        step = 1
        await models.collect.sync({
          force: true
        })
        await models.attention.sync({
          force: true
        })

        await models.like.sync({
          force: true
        })

        await models.thumb.sync({
          force: true
        })

        console.log(`${CURRENT_VERSION}版本升级完成`)
        await lowdb
          .get('config')
          .assign({ version: CURRENT_VERSION })
          .write()
        resolve(`${CURRENT_VERSION}版本升级完成`)
      } catch (err) {
        console.log('step', step)
        console.log('升级错误详解：' + err)
        reject(err)
      }
    })
  }
}

module.exports = update
