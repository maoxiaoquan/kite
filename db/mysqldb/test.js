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
  // let allUser = await models.user.findAll()
  // for (let i in allUser) {
  //   await models.virtual.create({
  //     // 用户虚拟币消息记录
  //     plus_less: 1,
  //     balance: 3000,
  //     amount: 3000,
  //     uid: allUser[i].uid,
  //     type: 8,
  //     action: 16
  //   })
  // }
  await models.virtual.sync({
    force: true
  })
  await models.sequelize.query(
    'ALTER TABLE user_info add COLUMN shell_total_amount DECIMAL(10,2)  comment "贝壳总额";'
  )

  await models.sequelize.query(
    'ALTER TABLE user_info add COLUMN shell_balance DECIMAL(10,2)  comment "贝壳余额";'
  )

  process.exit()
}
sql()
