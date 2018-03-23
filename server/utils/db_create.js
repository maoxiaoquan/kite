const db_create = require('./db')



const db_cr = async () => {
  await db_create.User.hasOne(db_create.userInfo) 
  await db_create.User.sync({ force: true, alter: true }).then(() => { console.log('users 表创建完成') }) //users 生成 
  await db_create.userInfo.sync({ force: true, alter: true }).then(() => { console.log('articles 表创建完成') }) //articles 生成
  await console.log('所有数据库创建完成')
  await process.exit()
}

db_cr()