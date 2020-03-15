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
class Book {
    /**
     * 获取用户列表操作
     * @param   {object} ctx 上下文对象
     */
    static getBookList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10, title, status } = req.body;
            let whereParams = {}; // 定义查询条件
            title && (whereParams['title'] = { [Op.like]: `%${title}%` });
            status && (whereParams['status'] = status);
            try {
                let { count, rows } = yield models.book.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date)
                        .format('YYYY-MM-DD H:m:s')
                        .toLocaleString());
                    let oneBooks = yield models.books.findOne({
                        where: { books_id: rows[i].books_id }
                    });
                    if (oneBooks) {
                        rows[i].setDataValue('books', yield models.books.findOne({
                            where: { books_id: rows[i].books_id }
                        }));
                    }
                    rows[i].setDataValue('commentCount', yield models.book_comment.count({
                        where: { book_id: rows[i].book_id }
                    }));
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
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
     * 更新小书章节
     * @param   {object} ctx 上下文对象
     */
    static updateBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id, status, rejection_reason } = req.body;
            try {
                yield models.book.update({
                    status,
                    rejection_reason
                }, {
                    where: {
                        book_id: book_id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新小书章节成功'
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
     * 删除小书章节
     * @param   {object} ctx 上下文对象
     * 删除小书章节判断是否有小书章节
     * 无关联则直接删除小书章节，有关联则开启事务同时删除与小书章节的关联
     */
    static deleteBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { book_id } = req.body;
            try {
                let oneBook = yield models.book.findOne({ where: { book_id } });
                if (oneBook) {
                    yield models.book.destroy({ where: { book_id } });
                    resAdminJson(res, {
                        state: 'success',
                        message: '删除小书章节成功'
                    });
                }
                else {
                    throw new Error('删除小书章节失败!');
                }
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
exports.default = Book;
