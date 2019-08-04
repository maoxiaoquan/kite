const sequelize = require('../../db/mysqldb/init')
const models = require('../../db/mysqldb/define')(sequelize)
const { lowdb } = require('../../db/lowdb/index')
const dfDynamicTopicList = require('../../server/libs/dfDynamicTopicList')
const CURRENT_VERSION = 0.3
const ADD_AUTHORITY = [
  {
    authority_description: 'dynamic',
    authority_id: 'xWIFibb79',
    authority_name: '动态管理',
    authority_parent_id: '',
    authority_parent_name: '',
    authority_sort: 4,
    authority_type: '1',
    authority_url: 'dynamic',
    enable: true
  },
  {
    authority_description: '动态话题',
    authority_id: 'iZA1hoZbJ',
    authority_name: '动态话题',
    authority_parent_id: 'xWIFibb79',
    authority_parent_name: '动态管理',
    authority_sort: 0,
    authority_type: '1',
    authority_url: 'dynamicTopic',
    enable: true
  },
  {
    authority_description: '查看所有动态',
    authority_id: 'MopXJpRWJ',
    authority_name: '查看所有动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 0,
    authority_type: '2',
    authority_url: '/dynamic-topic/all',
    enable: false
  },
  {
    authority_description: '获取动态话题列表',
    authority_id: 'yzTgrYRj1',
    authority_name: '获取动态话题列表',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 1,
    authority_type: '2',
    authority_url: '/dynamic-topic/list',
    enable: false
  },
  {
    authority_description: '创建动态话题',
    authority_id: 'rti2yTBeF',
    authority_name: '创建动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 2,
    authority_type: '2',
    authority_url: '/dynamic-topic/create',
    enable: false
  },
  {
    authority_description: '更新动态话题',
    authority_id: 'TCYdHQC8-',
    authority_name: '更新动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 3,
    authority_type: '2',
    authority_url: '/dynamic-topic/update',
    enable: false
  },
  {
    authority_description: '删除动态话题',
    authority_id: 'UKpCTczAb',
    authority_name: '删除动态话题',
    authority_parent_id: 'iZA1hoZbJ',
    authority_parent_name: '动态话题',
    authority_sort: 4,
    authority_type: '2',
    authority_url: '/dynamic-topic/delete',
    enable: false
  }
]
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
        await models.dynamic_topic.bulkCreate(dfDynamicTopicList)
        await models.admin_authority.bulkCreate(ADD_AUTHORITY)
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
