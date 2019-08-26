const models = require('./index')

// 当前js是用来调试 sql 使用，请勿用作其他用途、
try {
  async function add () {
    await models.sequelize.query(
      'alter table article_tag add column is_push tinyint(1);'
    )
    await models.sequelize.query(
      'alter table dynamic_topic add column is_push tinyint(1);'
    )
  }
  add()
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
