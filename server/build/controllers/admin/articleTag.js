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
class ArticleTag {
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建标签
     * @param   {object} ctx 上下文对象
     */
    static createArticleTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let oneArticleTagName = yield models.article_tag.findOne({
                    where: { name: reqData.name }
                });
                if (oneArticleTagName) {
                    throw new Error('标签名已存在!');
                }
                let oneArticleTagEnName = yield models.article_tag.findOne({
                    where: { en_name: reqData.en_name }
                });
                if (oneArticleTagEnName) {
                    throw new Error('标签名英文已存在!');
                }
                yield models.article_tag.create({
                    name: reqData.name,
                    en_name: reqData.en_name,
                    icon: reqData.icon || '/default/img/tag.webp',
                    description: reqData.description,
                    enable: reqData.enable,
                    is_push: reqData.is_push
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功创建了‘${reqData.name}’文章标签`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '标签创建成功'
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
     * 获取标签列表操作
     * @param   {object} ctx 上下文对象
     */
    static getArticleTagList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.article_tag.findAndCountAll({
                    where: '',
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
     * 获取所有标签操作
     * @param   {object} ctx 上下文对象
     */
    static getArticleTagAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let articleTagAll = yield models.article_tag.findAll({
                    where: { enable: 1 } // 为空，获取全部，也可以自己添加条件
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        article_tag_all: articleTagAll
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
    static updateArticleTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.article_tag.update({
                    name: reqData.name,
                    en_name: reqData.en_name,
                    icon: reqData.icon,
                    description: reqData.description,
                    enable: reqData.enable,
                    is_push: reqData.is_push
                }, {
                    where: {
                        tag_id: reqData.tag_id // 查询条件
                    }
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功更新了id为‘${reqData.tag_id}’的文章标签名字为‘${reqData.name}’`
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
    /**
     * 删除标签
     */
    static deleteArticleTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag_id } = req.body;
            try {
                let oneArticleTag = yield models.article_tag.findOne({
                    where: { tag_id }
                });
                yield models.article_tag.destroy({ where: { tag_id } });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功删除了‘${oneArticleTag.name}’文章标签`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除用户成功'
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
exports.default = ArticleTag;
