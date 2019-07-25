const models = require('./index')

models.adminUser
  .sync({
    force: true
  })
  .then(() => {
    console.log('所有数据表创建完成')
  })

models.adminRole
  .sync({
    force: true
  })
  .then(() => {
    console.log('所有数据表创建完成')
  })
