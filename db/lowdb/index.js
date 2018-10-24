const _Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const lowdb = new _Lowdb(new FileSync(path.resolve(__dirname, 'db.json')))

// Seed an empty DB
lowdb
  .defaults({
    posts2: {}
  })
  .write()

module.exports = {
  lowdb
}
