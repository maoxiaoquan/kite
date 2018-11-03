const router = require('koa-router')()
const index = require('../controllers/index') // 主页
const init = require('../controllers/init') // init

const RouterLimit = require('../utils/router_limit')

/*PAGE RENDER*/

router.get('/', index.render_get_index) // 主页 page

router.post('set_step', init.post_set_step) // 设置步骤

router.post('set_mysql', init.post_set_mysql) // set mysql

router.post('create_admin_user', init.post_create_admin_user) // set mysql

router.get('init', RouterLimit.Step, init.render_init) // init

router.get('init_step_one', RouterLimit.Step, init.render_init_step_one) // init one

router.get('init_step_two', RouterLimit.Step, init.render_init_step_two) // init two

router.get('init_step_three', RouterLimit.Step, init.render_init_step_three) // init three

module.exports = router
