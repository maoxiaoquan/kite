const models = require('./index')

// 当前js是用来调试 sql 使用，请勿用作其他用途、

async function sql () {
  // await models.sequelize.query(
  //   'ALTER TABLE article_tag add COLUMN is_push tinyint(1) DEFAULT 1 comment "是否加入首页或者推荐";'
  // )
  // await models.sequelize.query(
  //   'ALTER TABLE dynamic_topic add COLUMN is_push tinyint(1) DEFAULT 1 comment "是否加入首页或者推荐";'
  // )

  // await models.sequelize.query(
  //   'ALTER TABLE article_blog add COLUMN update_date datetime  comment "专栏内容更新时间";'
  // )
  // await models.sequelize.query(
  //   'ALTER TABLE article add COLUMN is_public tinyint(1) DEFAULT 1 comment "是否公开";'
  // )

  // await models.sequelize.query(
  //   'ALTER TABLE user add COLUMN username VARCHAR(200)  comment "用户名";'
  // )

  // await models.user_auth.sync({
  //   force: true
  // })

  // await models.user_info.sync({
  //   force: true
  // })

  // await models.virtual.update({ type: 18 }, { where: { type: 1 } })
  // await models.virtual.update({ type: 1 }, { where: { type: 2 } })
  // await models.virtual.update({ type: 2 }, { where: { type: 3 } })
  // await models.virtual.update({ type: 3 }, { where: { type: 4 } })
  // await models.virtual.update({ type: 9 }, { where: { type: 7 } })
  // await models.virtual.update({ type: 7 }, { where: { type: 6 } })
  // await models.virtual.update({ type: 17 }, { where: { type: 8 } })

  process.exit()
}
sql()
