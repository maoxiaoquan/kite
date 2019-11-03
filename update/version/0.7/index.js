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
          'rename TABLE dynamic_like to thumb_dynamic;'
        )

        await models.sequelize.query(
          'ALTER TABLE user_message add COLUMN action INTEGER(10) comment "1:系统消息,2:喜欢,3:收藏 ,4:关注 ,5:评论,6:回复,7:赞";'
        )

        await models.sequelize.query(
          'ALTER TABLE user_message add COLUMN sender_id BIGINT(20) comment "发送者ID";'
        )

        await models.sequelize.query(
          'ALTER TABLE article_comment add COLUMN reply_id BIGINT(20) comment "回复评论ID";'
        )

        await models.sequelize.query(
          'ALTER TABLE book_comment add COLUMN reply_id BIGINT(20) comment "回复评论ID";'
        )

        await models.sequelize.query(
          'ALTER TABLE books_comment add COLUMN reply_id BIGINT(20) comment "回复评论ID";'
        )

        await models.sequelize.query(
          'ALTER TABLE dynamic_comment add COLUMN reply_id BIGINT(20) comment "回复评论ID";'
        )

        // 2019.11.3 16:37新增
        await models.sequelize.query(
          'ALTER TABLE user_info add COLUMN shell_total_amount BIGINT(20) comment "贝壳总额";'
        )

        await models.sequelize.query(
          'ALTER TABLE user_info add COLUMN shell_balance BIGINT(20) comment "贝壳余额";'
        )

        await models.sequelize.query(
          'ALTER TABLE user_info add COLUMN is_msg_push INTEGER(5) DEFAULT 2 comment "是否开启消息推送 1:开启;2:关闭";'
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
