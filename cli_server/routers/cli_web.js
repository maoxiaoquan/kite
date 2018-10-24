const router = require('koa-router')()
const index = require('../controllers/index') // 主页
const init = require('../controllers/init') // init

/*PAGE RENDER*/

router.get('/', index.render_get_index) // 主页 page

router.get('init', init.render_init) // init

router.get('init_step_one', init.render_init_step_one) // init one

router.get('init_step_two', init.render_init_step_two) // init two

router.get('init_step_three', init.render_init_step_three) // init three

module.exports = router
