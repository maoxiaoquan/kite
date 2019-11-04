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

  // 2019.11.3 16:37新增
  await models.sequelize.query(
    'ALTER TABLE user_info add COLUMN shell_total_amount BIGINT(20) DEFAULT 2000 comment "贝壳总额";'
  )

  await models.sequelize.query(
    'ALTER TABLE user_info add COLUMN shell_balance BIGINT(20) DEFAULT 2000 comment "贝壳余额";'
  )

  await models.sequelize.query(
    'ALTER TABLE user_info add COLUMN is_msg_push INTEGER(5) DEFAULT 2 comment "是否开启消息推送 1:开启;2:关闭";'
  )

  process.exit()
}
sql()
