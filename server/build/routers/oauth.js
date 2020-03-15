"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../controllers/client/oauth/index")); // 经验
const router = express_1.default.Router();
const tokens = require('../utils/tokens'); // 登录tokens
router.get('/github-oauth', index_1.default.githubAuth); // 登录数据 post TYPE:RENDER 
router.get('/github-login-oauth', tokens.ClientVerifyTokenInfo, index_1.default.githubLoginAuth); // 登录数据 post TYPE:RENDER
router.post('/delete-oauth', tokens.ClientVerifyToken, index_1.default.githubDeleteAuth); // 登录数据 post TYPE:RENDER
module.exports = router;
