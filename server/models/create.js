const models = require('./index')
models.sequelize.sync({force: true /* alter: true */}).then(() => {
  console.log('所有数据表创建完成')
  process.exit()
})
