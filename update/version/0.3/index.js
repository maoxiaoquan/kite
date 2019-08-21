const sequelize = require('../../../db/mysqldb/init')
const models = require('../../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../../db/lowdb/index')
const dfDynamicTopicList = require('../../../server/libs/dfDynamicTopicList')
const CURRENT_VERSION = 0.3
const newAdminAuthorityList = require('./libs/newAdminAuthorityList')
const newUserAuthorityList = require('./libs/newUserAuthorityList')
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
        await models.sequelize.query(
          'ALTER TABLE admin_authority CHANGE authority_id authority_id VARCHAR(100) comment "权限ID";'
        )
        await models.sequelize.query(
          'ALTER TABLE user_authority CHANGE authority_id authority_id VARCHAR(100) comment "权限ID";'
        )

        await models.admin_authority.update(
          {
            authority_url: '/article-comment/list'
          },
          {
            where: {
              authority_id: 'vAlRwG42i' // 查询条件
            }
          }
        )

        await models.admin_authority.update(
          {
            authority_url: '/article-comment/update'
          },
          {
            where: {
              authority_id: 'Aj46PocjE' // 查询条件
            }
          }
        )

        await models.admin_authority.update(
          {
            authority_url: '/article-comment/delete'
          },
          {
            where: {
              authority_id: 'NgMPyBTyt' // 查询条件
            }
          }
        )

        await models.admin_authority.update(
          {
            authority_parent_id: 'f-AaZjGoX4K',
            authority_parent_name: '文章管理'
          },
          {
            where: {
              authority_id: 'yoUnDy1tf' // 查询条件
            }
          }
        )

        await models.dynamic_topic.bulkCreate(dfDynamicTopicList)
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

module.exports = update0_3
