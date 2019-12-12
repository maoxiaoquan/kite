const apiCli = require('./apiCli')

module.exports = app => {
  app.use('/', apiCli)
}
