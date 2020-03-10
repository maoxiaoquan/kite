const models = require('./index')

// 当前js是用来调试 sql 使用，请勿用作其他用途、

async function sql() {
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

  process.exit()
}
sql()
