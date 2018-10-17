const models = require('./index')
/* alter: true */
/*
models.sequelize.sync({force: true}).then(() => {
  console.log('所有数据表创建完成')
  process.exit()
})
*/


/**/

models.admin_system_log.sync({force: true /* alter: true */}).then(() => {
  console.log('所有数据表创建完成')
  process.exit()
})