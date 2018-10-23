const router = require('koa-router')()
const index = require('../controllers/index') // 主页

/*PAGE RENDER*/

router.get('/', index.render_get_index) // 主页 page

module.exports = router
