const path = require('path');
const fs = require('fs');

module.exports = async (ctx) => {
  const html = fs.readFileSync(path.resolve(__dirname, '../../static/asset/index.html'), 'utf-8')
  ctx.response.body = html
}