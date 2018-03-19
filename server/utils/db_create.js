const db_create = require('./db')


db_create.User.sync({ force: true })
db_create.Article.sync({ force: true })


process.on('SIGINT', function () {
  process.exit();
});



