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
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../db/mysqldb/index');
const { resAdminJson } = require('../../utils/resData');
const { createAdminSystemLog } = require('./adminSystemLog');
class ArticleColumn {
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建标签
     * @param   {object} ctx 上下文对象
     */
    static createArticleColumn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let oneArticleColumnName = yield models.article_column.findOne({
                    where: { name: reqData.name }
                });
                if (oneArticleColumnName) {
                    throw new Error('专栏名已存在!');
                }
                let oneArticleColumnEnName = yield models.article_column.findOne({
                    where: { en_name: reqData.en_name }
                });
                if (oneArticleColumnEnName) {
                    throw new Error('专栏英文名已存在!');
                }
                if (reqData.en_name === 'all') {
                    throw new Error('英文名字不能等于all');
                }
                yield models.article_column.create(Object.assign(Object.assign({}, reqData), { tag_ids: reqData.tag_ids.join(',') }));
                yield createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 3,
                    content: `成功创建了‘${reqData.name}’文章专栏`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '专栏创建成功'
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
    static getArticleColumnList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.article_column.findAndCountAll({
                    attributes: [
                        'column_id',
                        'name',
                        'en_name',
                        'icon',
                        'tag_ids',
                        'description',
                        'sort',
                        'is_home',
                        'enable'
                    ],
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: [
                        ['sort', 'ASC'] // asc
                    ]
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
     * 更新专栏
     * @param   {object} ctx 上下文对象
     */
    static updateArticleColumn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                if (reqData.en_name === 'all') {
                    throw new Error('全站默认专栏不能修改');
                }
                yield models.article_column.update(Object.assign(Object.assign({}, reqData), { tag_ids: reqData.tag_ids.join(',') }), {
                    where: {
                        column_id: reqData.column_id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新专栏成功'
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
    static deleteArticleColumn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { column_id } = req.body;
            yield models.article_column
                .destroy({ where: { column_id } })
                .then((data) => {
                resAdminJson(res, {
                    state: 'success',
                    message: '删除专栏成功'
                });
            })
                .catch((err) => {
                console.log('failed: ' + err);
                resAdminJson(res, {
                    state: 'error',
                    message: '删除专栏失败'
                });
            });
        });
    }
}
exports.default = ArticleColumn;
