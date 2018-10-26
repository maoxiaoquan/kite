const _Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const lowdb = new _Lowdb(new FileSync(path.resolve(__dirname, 'db.json')))

// Seed an empty DB

if (!lowdb.has('cli').value()) {
  // 设置cli 的默认步骤
  lowdb.set('cli', { step: 0, is_success: false }).write()
}

if (!lowdb.has('config').value()) {
  lowdb.set('config', {}).write()
}

module.exports = {
  lowdb
}
