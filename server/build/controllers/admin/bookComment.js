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
const moment_1 = __importDefault(require("moment"));
const Op = require('sequelize').Op;
class BookComment {
    /**
     * 获取标分页评论列表操作
     * @param   {object} ctx 上下文对象
     */
    static getCommentList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10, content, status } = req.body;
            try {
                let whereParams = {}; // 定义查询条件
                content && (whereParams['content'] = { [Op.like]: `%${content}%` });
                status && (whereParams['status'] = status);
                let { count, rows } = yield models.book_comment.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date).format('YYYY-MM-DD H:m:s'));
                    rows[i].setDataValue('books', (yield models.book.findOne({
                        where: { books_id: rows[i].books_id }
                    })) || []);
                    rows[i].setDataValue('book', (yield models.book.findOne({
                        where: { book_id: rows[i].book_id }
                    })) || []);
                }
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
            }
        });
    }
    /**
     * 更新评论
     * @param   {object} ctx 上下文对象
     */
    static updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield yield models.book_comment.update({
                    status: reqData.status
                }, {
                    where: {
                        id: reqData.id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新评论成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
            }
        });
    }
    /**
     * 删除评论
     */
    static deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                yield models.book_comment.destroy({ where: { id } });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除用户评论成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
            }
        });
    }
}
exports.default = BookComment;
