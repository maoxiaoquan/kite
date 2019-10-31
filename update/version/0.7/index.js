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
          'ALTER TABLE article CHANGE status status VARCHAR(30) comment "状态 审核成功、审核失败、待审核、免审核、已删除";'
        )
        await models.sequelize.query(
          'ALTER TABLE article CHANGE type type VARCHAR(30) comment "文章 笔记 草稿";'
        )
        await models.sequelize.query(
          'ALTER TABLE article_blog CHANGE status status VARCHAR(30) comment "状态 审核成功、审核失败、待审核、免审核";'
        )

        // 文章
        await models.article.update(
          {
            status: 'review_success'
          },
          {
            where: {
              status: 2
            }
          }
        )

        await models.article.update(
          {
            status: 'free_review'
          },
          {
            where: {
              status: 6
            }
          }
        )

        await models.article.update(
          {
            status: 'pending_review'
          },
          {
            where: {
              status: 1
            }
          }
        )

        await models.article.update(
          {
            type: 'article'
          },
          {
            where: {
              type: 1
            }
          }
        )

        await models.article_blog.update(
          {
            status: 'free_review'
          },
          {
            where: {
              status: 4
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
