const _Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const lowdb = new _Lowdb(new FileSync(path.resolve(__dirname, 'db.json')))

// Seed an empty DB

if (!lowdb.has('cli').value()) {
  // 设置cli 的默认步骤
  lowdb.set('cli', { step: 0, is_success: false }).write()
}

if (!lowdb.has('mysql').value()) {
  lowdb.set('mysql', {}).write()
}

if (!lowdb.has('config').value()) {
  lowdb.set('config', {}).write()
}

if (!lowdb.has('email').value()) {
  lowdb.set('email', {}).write()
}

if (!lowdb.has('website').value()) {
  lowdb.set('website', {}).write()
}

if (!lowdb.has('thirdParty').value()) { // 第三方所用
  lowdb.set('thirdParty', {}).write()
}

module.exports = {
  lowdb
}
