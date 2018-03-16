const router = require('koa-router')();

const home = require('./home');
const admins = require('./admin');
const api = require('./api');

router.use('/', home.routes(), home.allowedMethods());
router.use('/admin', admins.routes(), admins.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

module.exports = router;
