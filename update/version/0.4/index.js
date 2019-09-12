const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../../db/lowdb/index')
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const CURRENT_VERSION = 0.4
class update0_4 {
  static update () {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`正在升级中，当前版本是${CURRENT_VERSION}....`)

        await models.rss_article_blog.sync({
          force: true
        })

        await models.sequelize.query(
          'ALTER TABLE article_blog CHANGE rss_count read_count INTEGER(10) comment "阅读数量";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN status INTEGER(10) DEFAULT 1 comment "状态";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN en_name VARCHAR(10) DEFAULT 0 comment "英文名字";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN is_public tinyint(1) DEFAULT 0 comment "是否公开";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN like_count bigint(20) DEFAULT 0 comment "个人专栏like数量";'
        )

        await models.sequelize.query(
          'ALTER TABLE article CHANGE user_topic_ids blog_ids VARCHAR(200) comment "所属的blog";'
        )
        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN tag_ids VARCHAR(180)  comment "个人专栏所属的标签id";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_blog add COLUMN update_date datetime(0)  comment "专栏内容更新时间";'
        )

        await models.admin_authority.bulkCreate(newAdminAuthorityList)
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

module.exports = update0_4
