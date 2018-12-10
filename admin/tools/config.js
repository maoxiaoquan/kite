const path = require('path')

module.exports = {
  dev: {
    output: {
      path: path.resolve(process.cwd(), 'admin/dist')
    }
  },
  build: {
    output: {
      path: path.resolve(process.cwd(), 'static/dist')
    }
  }
}
