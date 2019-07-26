const sequelize = require('../../db/mysqldb/init')

const models = require('../../db/mysqldb/define')(sequelize)

async function update () {
  try {
    console.log('正在升级中，当前版本是0.2....')
    // await models.sequelize.query('rename TABLE admin_system_log to system_log;')
    // await models.sequelize.query('rename TABLE user_like_article to user_like;')
    // await models.sequelize.query(
    //   'rename TABLE subscribe_article_tag to subscribe_tag;'
    // )

    await models.sequelize.query('rename TABLE system_log to admin_system_log;')
    await models.sequelize.query('rename TABLE user_like to user_like_article;')
    await models.sequelize.query(
      'rename TABLE subscribe_tag to subscribe_article_tag;'
    )

    console.log('0.2版本升级完成')
    process.exit()
  } catch (err) {
    console.log('出现错误', err)
  }
}
update()
