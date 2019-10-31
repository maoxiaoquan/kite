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
    'ALTER TABLE article_blog CHANGE status status VARCHAR(30) comment "状态 审核成功、审核失败、待审核、免审核";'
  )
  // 文章
  await models.article_blog.update(
    {
      status: 'free_review'
    },
    {
      where: {
        status: 4
      }
    }
  )

  process.exit()
}
sql()
