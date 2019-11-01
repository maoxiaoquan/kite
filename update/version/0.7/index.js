const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
const CURRENT_VERSION = 0.7
class update {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)
        await models.sequelize.query(
          'rename TABLE dynamic_like to like_dynamic;'
        )
        // 文章
        await models.article.update(
          {
            status: 4
          },
          {
            where: {
              status: 6
            }
          }
        )

        await models.article_comment.update(
          {
            status: 4
          },
          {
            where: {
              status: 5
            }
          }
        )

        await models.dynamic_comment.update(
          {
            status: 4
          },
          {
            where: {
              status: 5
            }
          }
        )

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
