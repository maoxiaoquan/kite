const models = require('./index')

models.admin_user.sync({
  force: true
}).then(() => {
  console.log('所有数据表创建完成')
})

models.admin_role.sync({
  force: true
}).then(() => {
  console.log('所有数据表创建完成')
})
