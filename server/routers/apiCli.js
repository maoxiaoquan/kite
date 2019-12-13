const express = require('express')
const router = express.Router()
const index = require('../controllers/cli/index') // 主页
const init = require('../controllers/cli/init') // init

const RouterLimit = require('../utils/cliRouterLimit')

/* PAGE RENDER */

router.get('/', index.renderGetIndex) // 主页 page

router.get('/init', RouterLimit.Step, init.cliInit) // init

router.get('/init_step_one', RouterLimit.Step, init.cliInitStepOne) // init one

router.get('/init_step_two', RouterLimit.Step, init.cliInitStepTwo) // init two

router.get('/admininit_step_three', RouterLimit.Step, init.cliInitStepThree) // init three

router.post('/set_step', init.cliSetStep) // 设置步骤

router.post('/set_mysql', init.cliSetMysql) // set mysql

router.post('/create_admin_user', init.cliCreateAdminUser) // set mysql

router.post('/restart_project', init.cliRestartProject) // restart project

module.exports = router
