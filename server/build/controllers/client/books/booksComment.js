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
const models = require('../../../../../db/mysqldb/index');
const moment_1 = __importDefault(require("moment"));
const { resClientJson } = require('../../../utils/resData');
const Op = require('sequelize').Op;
const trimHtml = require('trim-html');
const xss = require('xss');
const clientWhere = require('../../../utils/clientWhere');
const config = require('../../../../../config');
const { TimeNow, TimeDistance } = require('../../../utils/time');
const constant_1 = require("../../../utils/constant");
const { reviewSuccess, freeReview, pendingReview, reviewFail } = constant_1.statusList;
const userMessage = require('../../../utils/userMessage');
const userVirtual_1 = __importDefault(require("../../../common/userVirtual"));
/* 评论模块 */
class BooksComment {
    static getBooksCommentList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let books_id = req.query.books_id;
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 10;
            try {
                let { count, rows } = yield models.books_comment.findAndCountAll({
                    // 默认一级评论
                    where: {
                        books_id,
                        parent_id: 0,
                        status: {
                            [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
                        }
                    },
                    offset: (page - 1) * pageSize,
                    limit: Number(pageSize),
                    order: [['create_date', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    if (Number(rows[i].status) === pendingReview) {
                        rows[i].setDataValue('content', '当前用户评论需要审核');
                    }
                    if (Number(rows[i].status) === reviewFail) {
                        rows[i].setDataValue('content', '当前用户评论违规');
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                }
                for (let item in rows) {
                    // 循环取子评论
                    let childAllComment = yield models.books_comment.findAll({
                        where: {
                            parent_id: rows[item].id,
                            status: {
                                [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail]
                            }
                        }
                    });
                    rows[item].setDataValue('children', childAllComment);
                    for (let childCommentItem in childAllComment) {
                        // 循环取用户  代码有待优化，层次过于复杂
                        childAllComment[childCommentItem].setDataValue('create_dt', yield TimeDistance(childAllComment[childCommentItem].create_date));
                        childAllComment[childCommentItem].setDataValue('user', yield models.user.findOne({
                            where: { uid: childAllComment[childCommentItem].uid },
                            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                        }));
                        if (childAllComment[childCommentItem].reply_uid !== 0 &&
                            childAllComment[childCommentItem].reply_uid !==
                                childAllComment[childCommentItem].uid) {
                            childAllComment[childCommentItem].setDataValue('reply_user', yield models.user.findOne({
                                where: { uid: childAllComment[childCommentItem].reply_uid },
                                attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                            }));
                        }
                    }
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '获取评论列表成功',
                    data: {
                        page,
                        pageSize,
                        count,
                        comment_list: rows
                    }
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 新建评论post提交
     * @param   {object} ctx 上下文对象
     */
    static createBooksComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                if (!reqData.content) {
                    throw new Error('请输入评论内容');
                }
                let date = new Date();
                let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
                let oneBooks = yield models.books.findOne({
                    where: {
                        books_id: reqData.books_id
                    }
                });
                if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
                    throw new Error(`当前用户因违规已被管理员禁用发布评论，时间到：${moment_1.default(user.ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`);
                }
                // 虚拟币判断是否可以进行继续的操作
                const isVirtual = yield userVirtual_1.default.isVirtual({
                    uid: user.uid,
                    type: constant_1.modelName.books,
                    action: constant_1.modelAction.comment
                });
                if (!isVirtual) {
                    throw new Error('贝壳余额不足！');
                }
                let allUserRole = yield models.user_role.findAll({
                    where: {
                        user_role_id: {
                            [Op.or]: user.user_role_ids.split(',')
                        },
                        user_role_type: 1 // 用户角色类型1是默认角色
                    }
                });
                let userAuthorityIds = '';
                allUserRole.map((roleItem) => {
                    userAuthorityIds += roleItem.user_authority_ids + ',';
                });
                let status = ~userAuthorityIds.indexOf(config.BOOKS.dfNoReviewBooksCommentId)
                    ? freeReview // 免审核
                    : pendingReview; // 待审核
                yield models.books_comment
                    .create({
                    parent_id: reqData.parent_id || 0,
                    books_id: reqData.books_id,
                    star: reqData.star || 0,
                    uid: user.uid,
                    reply_uid: reqData.reply_uid || 0,
                    content: xss(reqData.content),
                    status
                })
                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                    yield models.books.update({
                        // 更新小书评论数
                        comment_count: yield models.books_comment.count({
                            where: {
                                books_id: reqData.books_id,
                                parent_id: 0
                            }
                        })
                    }, { where: { books_id: reqData.books_id } });
                    const oneUser = yield models.user.findOne({
                        where: { uid: user.uid }
                    }); // 查询当前评论用户的信息
                    let _data = Object.assign(Object.assign({}, data.get({
                        plain: true
                    })), { children: [], user: oneUser });
                    if (reqData.reply_uid &&
                        reqData.reply_uid !== 0 &&
                        reqData.reply_uid !== user.uid) {
                        _data.reply_user = yield models.user.findOne({
                            where: { uid: reqData.reply_uid },
                            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                        });
                    }
                    _data['create_dt'] = yield TimeDistance(_data.create_date);
                    // 虚拟币消耗后期开启事物
                    yield userVirtual_1.default.setVirtual({
                        uid: user.uid,
                        associate: reqData.books_id,
                        type: constant_1.modelName.books,
                        action: constant_1.modelAction.comment,
                        ass_uid: oneBooks.uid
                    });
                    if (oneBooks.uid !== user.uid) {
                        // 屏蔽自己
                        yield userVirtual_1.default.setVirtual({
                            uid: oneBooks.uid,
                            associate: reqData.books_id,
                            type: constant_1.modelName.books,
                            action: constant_1.modelAction.obtain_comment,
                            ass_uid: user.uid
                        });
                    }
                    if (oneBooks.uid !== user.uid && !reqData.reply_id) {
                        yield userMessage.setMessage({
                            uid: oneBooks.uid,
                            sender_id: user.uid,
                            action: constant_1.userMessageAction.comment,
                            type: constant_1.modelName.books,
                            content: reqData.books_id
                        });
                    }
                    if (reqData.reply_id &&
                        reqData.reply_id !== 0 &&
                        reqData.reply_uid !== user.uid) {
                        yield userMessage.setMessage({
                            uid: reqData.reply_uid,
                            sender_id: user.uid,
                            action: constant_1.userMessageAction.reply,
                            type: constant_1.modelName.books,
                            content: reqData.books_id
                        });
                    }
                    resClientJson(res, {
                        state: 'success',
                        data: _data,
                        message: Number(status) === freeReview ? '评论成功' : '评论成功,待审核可见'
                    });
                }))
                    .catch((err) => {
                    resClientJson(res, {
                        state: 'error',
                        message: '回复失败:' + err
                    });
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 删除评论post提交
     * @param   {object} ctx 上下文对象
     */
    static deleteBooksComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                let allComment = yield models.books_comment
                    .findAll({ where: { parent_id: reqData.comment_id } })
                    .then((res) => {
                    return res.map((item, key) => {
                        return item.id;
                    });
                });
                if (allComment.length > 0) {
                    // 判断当前评论下是否有子评论,有则删除子评论
                    yield models.books_comment.destroy({
                        where: {
                            id: { [Op.in]: allComment },
                            uid: user.uid
                        }
                    });
                }
                yield models.books_comment.destroy({
                    where: {
                        id: reqData.comment_id,
                        uid: user.uid
                    }
                });
                yield models.books.update({
                    // 更新小书评论数
                    comment_count: yield models.books_comment.count({
                        where: {
                            books_id: reqData.books_id,
                            parent_id: 0
                        }
                    })
                }, { where: { books_id: reqData.books_id } });
                resClientJson(res, {
                    state: 'success',
                    message: '删除成功'
                });
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
}
exports.default = BooksComment;
