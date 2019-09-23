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
  await models.user_authority.bulkCreate([
    {
      authority_description: '用户修改头像不需要审核',
      authority_id: 'dfUserAvatarNoReviewId',
      authority_name: '用户修改头像不需要审核',
      authority_parent_id: 'vckA5WVEG',
      authority_parent_name: '用户模块',
      authority_sort: 1,
      authority_type: '2',
      authority_url: '',
      enable: true
    }
  ])

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
