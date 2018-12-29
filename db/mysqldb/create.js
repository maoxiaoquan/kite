const models = require('./index')
/* alter: true */

models.comment.sync({force: true}).then(() => {
  console.log('所有数据表创建完成')
  process.exit()
})

/**/

/*
mysqldb.admin_system_log.sync({force: true /!* alter: true *!/}).then(() => {
  console.log('所有数据表创建完成')
  process.exit()
})*/
