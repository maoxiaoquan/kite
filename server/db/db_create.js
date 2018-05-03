const db_create = require('./db')



const db_cr = async () => {
  await db_create.user.sync({ force: true, alter: true }).then(() => { console.log('user 表创建完成') }) //user 生成
  await db_create.user_verify_code.sync({ force: true, alter: true }).then(() => { console.log('user_verify_code 表创建完成') }) //user_verify_code 生成
  await db_create.article.sync({ force: true, alter: true }).then(() => { console.log('article 表创建完成') }) //article 生成
  await db_create.ad_user.sync({ force: true, alter: true }).then(() => { console.log('ad_user 表创建完成') }) //ad_user 生成
  await db_create.userInfo.sync({ force: true, alter: true }).then(() => { console.log('articles 表创建完成') }) //articles 生成
  await console.log('所有数据库创建完成')
  await process.exit()
}

db_cr()