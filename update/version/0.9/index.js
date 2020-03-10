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
          'ALTER TABLE article add COLUMN is_attachment INTEGER(2) comment "是否添加附件";'
        )

        await models.order.update(
          { product_type: 7 },
          { where: { product_type: 6 } }
        )

        await models.virtual.update({ type: 18 }, { where: { type: 1 } })
        await models.virtual
          .update({ type: 1 }, { where: { type: 2 } })
          .tnen(async () => {
            await models.virtual.update({ type: 2 }, { where: { type: 3 } })
          })
        await models.virtual.update({ type: 3 }, { where: { type: 4 } })
        await models.virtual.update({ type: 9 }, { where: { type: 7 } })
        await models.virtual.update({ type: 7 }, { where: { type: 6 } })
        await models.virtual.update({ type: 17 }, { where: { type: 8 } })

        // 2020.3.10
        await models.user_message.destroy({ where: { is_read: false } })
        await models.user_message.destroy({ where: { is_read: true } })
        await models.virtual.destroy({ where: { plus_less: 2 } })
        await models.virtual.destroy({ where: { plus_less: 1 } })
        await models.user_info.update(
          {
            shell_balance: 1000
          },
          {
            where: {
              avatar_review_status: 2 // 查询条件
            }
          }
        )

        const allUser = await models.user.findAll()
        for (let i in allUser) {
          await models.virtual.create({
            // 用户虚拟币消息记录
            plus_less: 1,
            balance: 1000,
            amount: 1000,
            uid: allUser[i].uid,
            income: 1000,
            expenses: 0,
            type: 1,
            action: 16
          })
        }

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
