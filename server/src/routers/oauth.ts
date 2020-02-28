import express from 'express'
import oauth from '../controllers/client/oauth/index' // 经验
const router = express.Router()
const tokens = require('../utils/tokens') // 登录tokens

router.get('/github-oauth', oauth.githubAuth) // 登录数据 post TYPE:RENDER 

router.get('/github-login-oauth', tokens.ClientVerifyTokenInfo, oauth.githubLoginAuth) // 登录数据 post TYPE:RENDER

router.post('/delete-oauth', tokens.ClientVerifyToken, oauth.githubDeleteAuth) // 登录数据 post TYPE:RENDER


module.exports = router
