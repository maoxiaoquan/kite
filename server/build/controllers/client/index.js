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
const { resClientJson } = require('../../utils/resData');
const Op = require('sequelize').Op;
const { TimeNow, TimeDistance } = require('../../utils/time');
const clientWhere = require('../../utils/clientWhere');
const constant_1 = require("../../utils/constant");
class Index {
    static getIndexArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            let type = req.query.type || '';
            let sort = req.query.sort || 'newest';
            let whereArticleParams = {}; // 查询参数
            let orderParams = []; // 排序参数
            try {
                // where
                whereArticleParams = {
                    // 默认全部导入的专题
                    is_public: true,
                    status: {
                        [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                    }
                };
                // 判断是否有专题
                let allArticleTagId = []; // 全部禁止某些文章标签推送的id
                let allArticleTag = yield models.article_tag.findAll({
                    where: {
                        is_push: false
                    } // 为空，获取全部，也可以自己添加条件
                });
                if (allArticleTag && allArticleTag.length > 0) {
                    for (let item in allArticleTag) {
                        allArticleTagId.push(allArticleTag[item].tag_id);
                    }
                    whereArticleParams['tag_ids'] = {
                        [Op.notRegexp]: `${allArticleTagId.join('|')}`
                    };
                }
                type && (whereArticleParams['type'] = type);
                // sort
                // hottest 全部热门:
                sort === 'hottest' && orderParams.push(['comment_count', 'DESC']);
                // monthlyHottest 本月最热:
                sort === 'monthlyHottest' &&
                    (whereArticleParams['create_date'] = {
                        [Op.between]: [
                            new Date(TimeNow.showMonthFirstDay()),
                            new Date(TimeNow.showMonthLastDay())
                        ]
                    });
                // newest 最新推荐:
                sort === 'newest' && orderParams.push(['create_date', 'DESC']);
                if (!sort || sort === 'monthlyHottest' || sort === 'weeklyHottest') {
                    orderParams.push(['create_date', 'ASC']);
                }
                let { count, rows } = yield models.article.findAndCountAll({
                    where: whereArticleParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: orderParams,
                    attributes: [
                        'aid',
                        'uid',
                        'title',
                        'source',
                        'type',
                        'cover_img',
                        'read_count',
                        'thumb_count',
                        'comment_count',
                        'blog_ids',
                        'tag_ids',
                        'create_date',
                        'create_timestamp',
                    ]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    let oneArticleBlog = yield models.article_blog.findOne({
                        where: { blog_id: rows[i].blog_ids }
                    });
                    if (oneArticleBlog &&
                        ~[constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview].indexOf(oneArticleBlog.status)) {
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
                /* for (let item in rows) {// 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
                rows[item].create_dt = await moment(rows[item].create_date).format('YYYY-MM-DD')
                rows[item].user = await models.user.findOne({
                  where: {uid: rows[item].uid},
                  attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                })
              } */
                if (rows) {
                    resClientJson(res, {
                        state: 'success',
                        message: '数据返回成功',
                        data: {
                            count,
                            page,
                            pageSize,
                            article_list: rows,
                            sort
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
    static getColumnArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            let type = req.query.type || '';
            let columnEnName = req.query.columnEnName || '';
            let sort = req.query.sort || 'newest';
            let whereArticleParams = {}; // 查询参数
            let whereArticleColumnParams = {}; // 查询参数
            let orderParams = []; // 排序参数
            try {
                // where
                whereArticleParams = {
                    // 默认全部导入的专题
                    is_public: true,
                    status: {
                        [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                    }
                };
                type && (whereArticleParams['type'] = type);
                // sort
                if (!columnEnName || columnEnName === 'all') {
                    // 判断是否有专题
                    let allArticleTagId = []; // 全部禁止某些文章标签推送的id
                    let allArticleTag = yield models.article_tag.findAll({
                        where: {
                            is_push: false
                        } // 为空，获取全部，也可以自己添加条件
                    });
                    if (allArticleTag && allArticleTag.length > 0) {
                        for (let item in allArticleTag) {
                            allArticleTagId.push(allArticleTag[item].tag_id);
                        }
                        whereArticleParams['tag_ids'] = {
                            [Op.notRegexp]: `${allArticleTagId.join('|')}`
                        };
                    }
                }
                else {
                    whereArticleColumnParams['en_name'] = columnEnName;
                    let oneArticleColumn = yield models.article_column.findOne({
                        attributes: ['column_id', 'name', 'icon', 'tag_ids'],
                        where: whereArticleColumnParams // 为空，获取全部，也可以自己添加条件
                    });
                    // 判断专栏下方是否有专题
                    if (columnEnName && oneArticleColumn.tag_ids) {
                        whereArticleParams['tag_ids'] = {
                            [Op.regexp]: `${oneArticleColumn.tag_ids.split(',').join('|')}`
                        };
                    }
                }
                // sort
                // hottest 全部热门:
                sort === 'hottest' && orderParams.push(['comment_count', 'DESC']);
                // monthlyHottest 本月最热:
                sort === 'monthlyHottest' &&
                    (whereArticleParams['create_date'] = {
                        [Op.between]: [
                            new Date(TimeNow.showMonthFirstDay()),
                            new Date(TimeNow.showMonthLastDay())
                        ]
                    });
                // newest 最新推荐:
                sort === 'newest' && orderParams.push(['create_date', 'DESC']);
                if (!sort || sort === 'monthlyHottest' || sort === 'weeklyHottest') {
                    orderParams.push(['create_date', 'ASC']);
                }
                let { count, rows } = yield models.article.findAndCountAll({
                    where: whereArticleParams,
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                    order: orderParams,
                    attributes: [
                        'aid',
                        'uid',
                        'title',
                        'source',
                        'type',
                        'cover_img',
                        'read_count',
                        'thumb_count',
                        'comment_count',
                        'blog_ids',
                        'tag_ids',
                        'create_date',
                        'create_timestamp',
                    ]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    let oneArticleBlog = yield models.article_blog.findOne({
                        where: { blog_id: rows[i].blog_ids }
                    });
                    if (oneArticleBlog &&
                        ~[constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview].indexOf(oneArticleBlog.status)) {
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
                /* for (let item in rows) {// 循环取用户 render 渲染必须用这种方法 与 ajax 有区别
                rows[item].create_dt = await moment(rows[item].create_date).format('YYYY-MM-DD')
                rows[item].user = await models.user.findOne({
                  where: {uid: rows[item].uid},
                  attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                })
              } */
                if (rows) {
                    resClientJson(res, {
                        state: 'success',
                        message: '数据返回成功',
                        data: {
                            count,
                            page,
                            pageSize,
                            column_en_name: columnEnName,
                            article_list: rows,
                            sort
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
}
exports.default = Index;
