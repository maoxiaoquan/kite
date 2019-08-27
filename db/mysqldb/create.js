const models = require('./index')

// 当前js是用来调试 sql 使用，请勿用作其他用途、

async function sql () {
  await models.sequelize.query(
    'ALTER TABLE article_tag add COLUMN is_push tinyint(1) DEFAULT 1 comment "是否加入首页或者推荐";'
  )
  await models.sequelize.query(
    'ALTER TABLE dynamic_topic add COLUMN is_push tinyint(1) DEFAULT 1 comment "是否加入首页或者推荐";'
  )
  process.exit()
}
sql()

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
