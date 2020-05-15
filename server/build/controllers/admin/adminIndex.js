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
class AdminIndex {
    static adminIndexStatistics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminUserCount = yield models.admin_user.count(); // 后台用户统计
                const userCount = yield models.user.count(); // 前台用户统计
                // 无需审核系列
                // ----------------------------------文章统计
                const allArticleCount = yield models.article.count(); // 文章统计
                const noReviewArticleCount = yield models.article.count({
                    // 无需审核文章统计
                    where: {
                        status: 6,
                    },
                });
                const reviewArticleCount = yield models.article.count({
                    // 待审核文章统计
                    where: {
                        status: 1,
                    },
                });
                const reviewFailArticleCount = yield models.article.count({
                    // 审核失败文章统计
                    where: {
                        status: 3,
                    },
                });
                // ------------------------------------------文章评论统计
                const allCommentCount = yield models.article_comment.count(); // 评论统计
                const noReviewArticleCommentCount = yield models.article_comment.count({
                    where: {
                        status: 5,
                    },
                }); // 无需审核评论统计
                const reviewArticleCommentCount = yield models.article_comment.count({
                    where: {
                        status: 1,
                    },
                }); // 待审核评论统计
                const reviewFailArticleCommentCount = yield models.article_comment.count({
                    where: {
                        status: 3,
                    },
                }); // 审核失败评论统计
                // -----------------------------------动态统计
                const allDynamicCount = yield models.dynamic.count(); // 全部动态统计
                const noReviewDynamicCount = yield models.dynamic.count({
                    where: {
                        status: 4,
                    },
                }); // 无需审核动态统计
                const reviewDynamicCount = yield models.dynamic.count({
                    where: {
                        status: 1,
                    },
                }); // 待审核动态统计
                const reviewFailDynamicCount = yield models.dynamic.count({
                    where: {
                        status: 3,
                    },
                }); // 审核失败动态统计
                // ------------------------------------------文章评论统计
                const allDynamicCommentCount = yield models.dynamic_comment.count(); // 评论统计
                const noReviewDynamicCommentCount = yield models.dynamic_comment.count({
                    where: {
                        status: 5,
                    },
                }); // 无需审核评论统计
                const reviewDynamicCommentCount = yield models.dynamic_comment.count({
                    where: {
                        status: 1,
                    },
                }); // 待审核评论统计
                const reviewFailDynamicCommentCount = yield models.dynamic_comment.count({
                    where: {
                        status: 3,
                    },
                }); // 审核失败评论统计
                // -----------------------------------个人专栏统计
                const allArticleBlogCount = yield models.article_blog.count(); // 全部个人专栏统计
                const noReviewArticleBlogCount = yield models.article_blog.count({
                    where: {
                        status: 4,
                    },
                }); // 无需审核个人专栏统计
                const reviewArticleBlogCount = yield models.article_blog.count({
                    where: {
                        status: 1,
                    },
                }); // 待审核个人专栏统计
                const reviewFailArticleBlogCount = yield models.article_blog.count({
                    where: {
                        status: 3,
                    },
                }); // 审核失败个人专栏统计
                const userAll = yield models.user.findAll({
                    limit: 10,
                    attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
                    order: [['create_timestamp', 'desc']],
                });
                const articleAll = yield models.article.findAll({
                    limit: 10,
                    order: [['create_timestamp', 'desc']],
                });
                const commentAll = yield models.article_comment.findAll({
                    limit: 10,
                    order: [['create_timestamp', 'desc']],
                });
                for (const i in articleAll) {
                    articleAll[i].setDataValue('create_dt', yield moment_1.default(articleAll[i].create_date).format('YYYY-MM-DD H:m:s'));
                    articleAll[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: articleAll[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
                    }));
                }
                for (const i in commentAll) {
                    commentAll[i].setDataValue('create_dt', yield moment_1.default(commentAll[i].create_date).format('YYYY-MM-DD H:m:s'));
                    commentAll[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: commentAll[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction'],
                    }));
                }
                resAdminJson(res, {
                    state: 'success',
                    message: '获取统计信息成功',
                    data: {
                        articleCount: {
                            // 全部文章统计
                            allCount: allArticleCount || 0,
                            noReviewCount: noReviewArticleCount || 0,
                            reviewCount: reviewArticleCount || 0,
                            reviewFailCount: reviewFailArticleCount || 0,
                        },
                        articleCommentCount: {
                            // 全部文章评论统计
                            allCount: allCommentCount || 0,
                            noReviewCount: noReviewArticleCommentCount || 0,
                            reviewCount: reviewArticleCommentCount || 0,
                            reviewFailCount: reviewFailArticleCommentCount || 0,
                        },
                        dynamicCount: {
                            // 全部动态统计
                            allCount: allDynamicCount || 0,
                            noReviewCount: noReviewDynamicCount || 0,
                            reviewCount: reviewDynamicCount || 0,
                            reviewFailCount: reviewFailDynamicCount || 0,
                        },
                        dynamicCommentCount: {
                            // 全部动态评论统计
                            allCount: allDynamicCommentCount || 0,
                            noReviewCount: noReviewDynamicCommentCount || 0,
                            reviewCount: reviewDynamicCommentCount || 0,
                            reviewFailCount: reviewFailDynamicCommentCount || 0,
                        },
                        articleBlogCount: {
                            // 全部个人专栏统计
                            allCount: allArticleBlogCount || 0,
                            noReviewCount: noReviewArticleBlogCount || 0,
                            reviewCount: reviewArticleBlogCount || 0,
                            reviewFailCount: reviewFailArticleBlogCount || 0,
                        },
                        count: {
                            admin_user_count: adminUserCount,
                            user_count: userCount,
                            article_count: allArticleCount,
                            comment_count: allCommentCount,
                        },
                        new_article: articleAll,
                        new_user: userAll,
                        new_comment: commentAll,
                    },
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message,
                });
                return false;
            }
        });
    }
}
exports.default = AdminIndex;
