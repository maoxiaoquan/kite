import express from 'express'
import oauth from '../controllers/client/oauth/index' // 经验
const router = express.Router()

router.get('/github-oauth', oauth.githubAuth) // 登录数据 post TYPE:RENDER

router.get('/github-login-oauth', oauth.githubLoginAuth) // 登录数据 post TYPE:RENDER

module.exports = router
