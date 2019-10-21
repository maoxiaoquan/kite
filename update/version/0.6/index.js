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
          'ALTER TABLE rss_article_tag CHANGE article_tag_id tag_id VARCHAR(50) comment "文章标签";'
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

        await models.sequelize.query(
          'ALTER TABLE article_tag CHANGE article_tag_id tag_id VARCHAR(50) comment "文章标签";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_tag CHANGE article_tag_name name VARCHAR(50) comment "标签名字";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_tag CHANGE article_tag_en_name en_name VARCHAR(100) comment "标签英文名字";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_tag CHANGE article_tag_icon icon VARCHAR(200) comment "标签图标地址";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_tag CHANGE article_tag_description description VARCHAR(200) comment "标签描述";'
        )

        // 2019.10.18 0:46

        await models.sequelize.query(
          'ALTER TABLE article_column CHANGE article_column_id column_id VARCHAR(50) comment "文章专栏";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_column CHANGE article_column_name name VARCHAR(50) comment "专栏名字";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_column CHANGE article_column_en_name en_name VARCHAR(100) comment "专栏英文名字";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_column CHANGE article_column_icon icon VARCHAR(200) comment "专栏图标地址";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_column CHANGE article_column_description description VARCHAR(200) comment "专栏描述";'
        )

        // await models.sequelize.query(
        //   'ALTER TABLE article_column CHANGE article_tag_ids tag_ids longtext comment "标签id";'
        // )

        // await models.sequelize.query(
        //   'ALTER TABLE article CHANGE CHANGE article_tag_ids tag_ids longtext comment "标签id";'
        // )

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
