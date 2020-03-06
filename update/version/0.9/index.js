const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const lowdb = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
const CURRENT_VERSION = 0.9
let step = 0
class update {
  static update() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)
        step = 1
        await models.experience.sync({
          force: true
        })

        await models.chat_contact.sync({
          force: true
        })

        await models.chat_message.sync({
          force: true
        })

        await models.user_auth.sync({
          force: true
        })

        await models.article_annex.sync({
          force: true
        })

        await models.sequelize.query(
          'ALTER TABLE user_info add COLUMN experience BIGINT(20)  comment "经验总值";'
        )

        await models.sequelize.query(
          'ALTER TABLE user add COLUMN username VARCHAR(200)  comment "用户名";'
        )

        await models.sequelize.query(
          'ALTER TABLE article add COLUMN is_attachment tinyint(1) DEFAULT 0 comment "是否添加附件";'
        )

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
