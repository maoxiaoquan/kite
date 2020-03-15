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
const models = require('../../../../../db/mysqldb/index');
const { render, resClientJson } = require('../../../utils/resData');
const Op = require('sequelize').Op;
const clientWhere = require('../../../utils/clientWhere');
const constant_1 = require("../../../utils/constant");
const { reviewSuccess, freeReview, pendingReview, reviewFail } = constant_1.statusList;
const { TimeNow, TimeDistance } = require('../../../utils/time');
class PersonalCenter {
    /**
     * 用户个人中心个人文章列表render
     * @param   {object} ctx 上下文对象
     */
    static userMyArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            let blog_id = req.query.blog_id || 'all';
            let type = req.query.type || '';
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let whereParams = {
                uid,
                status: {
                    [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
                }
            };
            try {
                type && (whereParams.type = type);
                blog_id !== 'all' && (whereParams.blog_ids = blog_id);
                let { count, rows } = yield models.article.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
                });
                /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
                rows[item].create_dt = await moment(rows[item].create_date)
                  .format('YYYY-MM-DD H:m:s')
                rows[item].user = await models.user.findOne({
                  where: { uid: rows[item].uid },
                  attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                })
                } */
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    let oneArticleBlog = yield models.article_blog.findOne({
                        where: { blog_id: rows[i].blog_ids }
                    });
                    if (oneArticleBlog && ~[2, 4].indexOf(oneArticleBlog.status)) {
                        rows[i].setDataValue('article_blog', oneArticleBlog);
                    }
                    if (rows[i].tag_ids) {
                        rows[i].setDataValue('tag', yield models.article_tag.findAll({
                            where: {
                                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
                            }
                        }));
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: 'home',
                    data: {
                        count: count,
                        blog_id,
                        page,
                        pageSize,
                        list: rows
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
     * 用户个人中心用户关注用户render
     * @param   {object} ctx 上下文对象
     */
    static getUserAttentionList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let any = req.query.any || 'me';
            let whereParmas = {};
            try {
                if (any === 'me') {
                    whereParmas = {
                        uid: uid,
                        type: constant_1.modelName.user,
                        is_associate: true
                    };
                }
                else {
                    whereParmas = {
                        associate_id: uid,
                        type: constant_1.modelName.user,
                        is_associate: true
                    };
                }
                let { count, rows } = yield models.attention.findAndCountAll({
                    where: whereParmas,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: any === 'me' ? rows[i].associate_id : rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    rows[i].setDataValue('userAttentionIds', yield models.attention.findAll({
                        where: {
                            associate_id: any === 'me' ? rows[i].associate_id : rows[i].uid,
                            type: constant_1.modelName.user,
                            is_associate: true
                        }
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '获取列表成功',
                    data: {
                        count,
                        page,
                        pageSize,
                        list: rows,
                        any
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
     * 用户like文章render
     * @param   {object} ctx 上下文对象
     */
    static getUserLikeArticleList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            try {
                let allUserLikeArticle = yield models.like
                    .findAll({
                    where: { uid, is_associate: true, type: constant_1.modelName.article }
                })
                    .then((data) => {
                    return data.map((item, key) => {
                        return item.associate_id;
                    });
                });
                let where_params = { aid: { [Op.in]: allUserLikeArticle } };
                let { count, rows } = yield models.article.findAndCountAll({
                    where: where_params,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    if (rows[i].tag_ids) {
                        rows[i].setDataValue('tag', yield models.article_tag.findAll({
                            where: {
                                tag_id: { [Op.or]: rows[i].tag_ids.split(',') }
                            }
                        }));
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: 'home',
                    data: {
                        count: count,
                        page,
                        pageSize,
                        article_list: rows
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
    static getDynamicListMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.query;
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let whereParams = {}; // 查询参数
            let orderParams = [['create_date', 'DESC']]; // 排序参数
            try {
                // sort
                // hottest 全部热门:
                whereParams = {
                    uid,
                    status: {
                        [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
                    }
                };
                let { count, rows } = yield models.dynamic.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: orderParams
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('topic', rows[i].topic_ids
                        ? yield models.dynamic_topic.findOne({
                            where: { topic_id: rows[i].topic_ids }
                        })
                        : '');
                    rows[i].setDataValue('thumbCount', yield models.thumb.count({
                        where: {
                            associate_id: rows[i].id,
                            is_associate: true,
                            type: constant_1.modelName.dynamic
                        }
                    }));
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    rows[i].setDataValue('userAttentionIds', yield models.attention.findAll({
                        where: {
                            uid: rows[i].uid || '',
                            type: constant_1.modelName.user,
                            is_associate: true
                        }
                    }));
                }
                if (rows) {
                    resClientJson(res, {
                        state: 'success',
                        message: '数据返回成功',
                        data: {
                            count,
                            page,
                            pageSize,
                            list: rows
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '数据返回错误，请再次刷新尝试'
                    });
                }
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
     * 用户个人中心个人专栏列表
     * @param   {object} ctx 上下文对象
     */
    static userArticleBlogList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let whereParams = {
                uid
            };
            try {
                let { count, rows } = yield models.article_blog.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['update_date', 'desc']]
                });
                /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
                rows[item].create_dt = await moment(rows[item].create_date)
                  .format('YYYY-MM-DD H:m:s')
                rows[item].user = await models.user.findOne({
                  where: { uid: rows[item].uid },
                  attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                })
                } */
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('update_dt', yield TimeDistance(rows[i].update_dt));
                    rows[i].setDataValue('articleCount', yield models.article.count({
                        where: { blog_ids: rows[i].blog_id }
                    }));
                    rows[i].setDataValue('likeCount', yield models.collect.count({
                        where: {
                            associate_id: rows[i].blog_id,
                            is_associate: true,
                            type: constant_1.modelName.article_blog
                        }
                    }));
                    if (rows[i].tag_ids) {
                        rows[i].setDataValue('tag', yield models.article_tag.findAll({
                            where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
                        }));
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    rows[i].setDataValue('likeUserIds', yield models.collect.findAll({
                        where: {
                            associate_id: rows[i].blog_id,
                            is_associate: true,
                            type: constant_1.modelName.article_blog
                        }
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '获取用户个人专栏成功列表',
                    data: {
                        count: count,
                        page,
                        pageSize,
                        list: rows
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
     * 用户个人中心个人小书列表
     * @param   {object} ctx 上下文对象
     */
    static userBooksList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let whereParams = {
                uid,
                status: {
                    [Op.or]: [reviewSuccess, freeReview, pendingReview, reviewFail] // 审核成功、免审核
                }
            };
            try {
                let { count, rows } = yield models.books.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['update_date', 'desc']]
                });
                /* for (let item in rows) { // 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
                rows[item].create_dt = await moment(rows[item].create_date)
                  .format('YYYY-MM-DD H:m:s')
                rows[item].user = await models.user.findOne({
                  where: { uid: rows[item].uid },
                  attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                })
                } */
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('update_dt', yield TimeDistance(rows[i].update_dt));
                    rows[i].setDataValue('bookCount', yield models.book.count({
                        where: { books_id: rows[i].books_id }
                    }));
                    if (rows[i].tag_ids) {
                        rows[i].setDataValue('tag', yield models.article_tag.findAll({
                            where: { tag_id: { [Op.or]: rows[i].tag_ids.split(',') } }
                        }));
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '获取用户个人小书列表',
                    data: {
                        count,
                        page,
                        pageSize,
                        list: rows
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
}
exports.default = PersonalCenter;
