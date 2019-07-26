const models = require('./index')

// 当前js是用来调试 sql 使用，请勿用作其他用途、
try {
  models.sequelize.query('rename TABLE admin_system_log to system_log;')
  models.sequelize.query('rename TABLE user_like_article to user_like;')
  models.sequelize.query('rename TABLE subscribe_article_tag to subscribe_tag;')
  process.exit()
} catch (err) {
  console.log('出现错误', err)
}
// models.admin_user
//   .sync({
//     force: true
//   })
//   .then(() => {
//     console.log('所有数据表创建完成')
//   })

// models.admin_role
//   .sync({
//     force: true
//   })
//   .then(() => {
//     console.log('所有数据表创建完成')
//   })
