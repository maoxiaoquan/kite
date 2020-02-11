"use strict";
const _lowdb = require('../../../db/lowdb');
const KiteConfig = require('../../../kite.config');
const _config = _lowdb.read().value();
module.exports = {
    // 密码盐
    ENCRYPT_KEY: 'kite',
    DF_ARTICLE_TAG_IMG: `/default/img/default_article_tag.png`,
    DF_ICON: `/default/img/default_icon.png`,
    PUBLIC: {},
    USER: {
        dfUserAvatarNoReviewId: 'dfUserAvatarNoReviewId' // 用户头像免审核
    },
    USER_ROLE: {
        dfId: 'ordinary_role_100000',
        dfLegalizeId: 'commission_100000',
        dfManagementTeam: 'management_team'
    },
    USER_AUTHORITY: {
        dfNoReviewArticleId: 'no_review_article',
        dfNoReviewArticleCommentId: 'no_review_comment',
        dfNoReviewDynamicId: 'dfNoReviewDynamicId',
        dfNoReviewDynamicCommentId: 'dfNoReviewDynamicCommentId' // 无需审核动态评论的权限id
    },
    ARTICLE_TAG: {
        dfOfficialExclusive: 'dfOfficialExclusive' // 默认只能由官方使用的文章标签
    },
    DYNAMIC: {
        dfOfficialTopic: 'dfOfficialTopic',
        dfTreeHole: 'dfTreeHole' // 树洞话题
    },
    ARTICLE_BLOG: {
        dfNoReviewArticleBlogId: 'dfNoReviewArticleBlogId' // 发布个人专栏无需审核的权限id
    },
    BOOK: {
        dfNoReviewBookId: 'dfNoReviewBookId',
        dfNoReviewBookCommentId: 'dfNoReviewBookCommentId' // 发布小书章节评论无需审核
    },
    BOOKS: {
        dfNoReviewBooksId: 'dfNoReviewBooksId',
        dfNoReviewBooksCommentId: 'dfNoReviewBooksCommentId' // 发布小书评论无需审核
    },
    SUPER_ROLE_ID: '1000000',
    default_avatar: `${KiteConfig.server.default_avatar}`,
    database: {
        /* database set */
        DATABASE: _config.mysql.database,
        USERNAME: _config.mysql.username,
        PASSWORD: _config.mysql.password,
        SQL_TYPE: 'mysql',
        HOST: _config.mysql.host,
        MYSQL_PORT: _config.mysql.mysql_port // 端口号，MySQL默认3306
    }
};
