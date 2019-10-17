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

  await models.sequelize.query(
    'ALTER TABLE article_column CHANGE article_column_id column_id VARCHAR(50) comment "文章专栏";'
  )

  await models.sequelize.query(
    'ALTER TABLE article_column CHANGE article_column_name name VARCHAR(50) comment "专栏名字";'
  )

  await models.sequelize.query(
    'ALTER TABLE article_column CHANGE article_column_en_name en_name VARCHAR(100) comment "专栏英文名字";'
  )

  await models.sequelize.query(
    'ALTER TABLE article_column CHANGE article_column_icon icon VARCHAR(200) comment "专栏图标地址";'
  )

  await models.sequelize.query(
    'ALTER TABLE article_column CHANGE article_column_description description VARCHAR(200) comment "专栏描述";'
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
