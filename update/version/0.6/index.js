const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
const CURRENT_VERSION = 0.6
class update {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)

        await models.sequelize.query(
          'ALTER TABLE article_like add COLUMN is_like tinyint(1) comment "是否like";'
        )

        await models.sequelize.query(
          'rename TABLE article_like to like_article;'
        )

        await models.sequelize.query(
          'rename TABLE rss_article_blog to collect_blog;'
        )

        await models.sequelize.query(
          'rename TABLE rss_dynamic_topic to attention_topic;'
        )

        await models.sequelize.query(
          'rename TABLE rss_article_tag to attention_tag;'
        )

        await models.sequelize.query(
          'ALTER TABLE user_attention add COLUMN is_attention tinyint(1) comment "是否关注";'
        )

        await models.sequelize.query(
          'rename TABLE user_attention to attention_user;'
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
