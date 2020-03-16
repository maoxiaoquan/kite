const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const lowdb = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
const CURRENT_VERSION = 0.5
class update {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)

        await models.book.sync({
          force: true
        })
        await models.books.sync({
          force: true
        })
        await models.book_comment.sync({
          force: true
        })
        await models.books_comment.sync({
          force: true
        })
        await models.collect_books.sync({
          force: true
        })

        await models.admin_authority.bulkCreate(newAdminAuthorityList)
        await models.user_authority.bulkCreate(newUserAuthorityList)
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

module.exports = update
