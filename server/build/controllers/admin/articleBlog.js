"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../db/mysqldb/index');
const { resAdminJson } = require('../../utils/resData');
const adminSystemLog_1 = __importDefault(require("./adminSystemLog"));
const Op = require('sequelize').Op;
class ArticleBlog {
    /**
     * 获取标签列表操作
     * @param   {object} ctx 上下文对象
     */
    static getArticleBlogList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereParams = {}; // 定义查询条件
            const { page = 1, pageSize = 10, name, status } = req.query;
            try {
                name && (whereParams['name'] = { [Op.like]: `%${name}%` });
                status && (whereParams['status'] = status);
                let { count, rows } = yield models.article_blog.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        list: rows
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 更新标签
     * @param   {object} ctx 上下文对象
     */
    static updateArticleBlog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.article_blog.update({
                    status: reqData.status,
                    rejection_reason: reqData.rejection_reason || ''
                }, {
                    where: {
                        blog_id: reqData.blog_id // 查询条件
                    }
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功更新了id为‘${reqData.blog_id}’的个人专栏名字为‘${reqData.name}’`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新标签成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = ArticleBlog;
