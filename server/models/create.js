const models = require('./index')



const db_cr = async () => {
  /*-----------------home------------------*/
  await models.user.sync({ force: true, alter: true }).then(() => { console.log('user 表创建完成') }) //user 生成
  await models.user_verify_code.sync({ force: true, alter: true }).then(() => { console.log('user_verify_code 表创建完成') }) //user_verify_code 生成
  await models.article.sync({ force: true, alter: true }).then(() => { console.log('article 表创建完成') }) //article 生成

  /*-----------------admin------------------*/
  await models.ad_user.sync({ force: true, alter: true }).then(() => { console.log('ad_user 表创建完成') }) //ad_user 生成
  await models.ad_role.sync({ force: true, alter: true }).then(() => { console.log('ad_role 表创建完成') }) //ad_role 生成

  await models.ad_user_role.sync({ force: true, alter: true }).then(() => { console.log('ad_user_role 表创建完成') }) //ad_user_role 生成
  await models.ad_authority.sync({ force: true, alter: true }).then(() => { console.log('ad_authority 表创建完成') }) //ad_authority 生成
  await models.ad_role_authority.sync({ force: true, alter: true }).then(() => { console.log('ad_role_authority 表创建完成') }) //ad_role_authority 生成


  await console.log('所有数据表创建完成')
  await process.exit()
}

db_cr()