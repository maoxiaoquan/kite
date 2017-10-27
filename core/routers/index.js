const router = require('koa-router')();

const home = require('./home');
const admins = require('./admin');

router.use('/', home.routes(), home.allowedMethods());
router.use('/admin', admins.routes(), admins.allowedMethods());

module.exports = router;
