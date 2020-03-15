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
const { resClientJson } = require('../../../utils/resData');
const Op = require('sequelize').Op;
const trimHtml = require('trim-html');
const xss = require('xss');
const clientWhere = require('../../../utils/clientWhere');
const config = require('../../../../../config');
const { TimeNow, TimeDistance } = require('../../../utils/time');
const shortid = require('shortid');
const lowdb = require('../../../../../db/lowdb/index');
const constant_1 = require("../../../utils/constant");
const userVirtual_1 = __importDefault(require("../../../common/userVirtual"));
/* 动态专题模块模块 */
// 获取动态专题详情
class articleBlog {
    /**
     * 获取所有文章专题get
     * @param   {object} ctx 上下文对象
     */
    static getUserArticleBlogAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /* 获取所有文章专题 */
            let { uid } = req.query;
            try {
                let allUserArticleBlog = yield models.article_blog.findAll({
                    where: {
                        uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '获取当前用户个人专题成功',
                    data: {
                        list: allUserArticleBlog
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
     * 创建用户专题
     * @param   {object} ctx 上下文对象
     */
    static createUserArticleBlog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            /* 创建用户专题 */
            let { blog_name, en_name, description, icon, enable, tag_ids } = req.body;
            let { user = '' } = req;
            try {
                if (blog_name.length === 0) {
                    throw new Error('请输入文章专题名字');
                }
                let oneUserArticleBlog = yield models.article_blog.findOne({
                    where: {
                        uid: user.uid,
                        name: blog_name
                    }
                });
                let userArticleBlogCount = yield models.article_blog.count({
                    where: {
                        uid: user.uid
                    }
                });
                if (userArticleBlogCount > 50) {
                    throw new Error('当前只开放，用户创建的个人专栏上限为50个');
                }
                if (en_name) {
                    let enNameArticleBlog = yield models.article_blog.findOne({
                        where: {
                            en_name
                        }
                    });
                    if (enNameArticleBlog) {
                        throw new Error('英文名字已存在');
                    }
                    if (en_name.length > 60) {
                        throw new Error('英文名字小于60个字符');
                    }
                }
                // 虚拟币判断是否可以进行继续的操作
                const isVirtual = yield userVirtual_1.default.isVirtual({
                    uid: user.uid,
                    type: constant_1.modelName.article_blog,
                    action: constant_1.modelAction.create
                });
                if (!isVirtual) {
                    throw new Error('贝壳余额不足！');
                }
                let oneArticleTag = yield models.article_tag.findOne({
                    where: {
                        tag_id: config.ARTICLE_TAG.dfOfficialExclusive
                    }
                });
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                if (tag_ids) {
                    if (~tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
                        if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
                            throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能使用`);
                        }
                    }
                }
                let userRoleALL = yield models.user_role.findAll({
                    where: {
                        user_role_id: {
                            [Op.or]: user.user_role_ids.split(',')
                        },
                        user_role_type: 1 // 用户角色类型1是默认角色
                    }
                });
                let userAuthorityIds = '';
                userRoleALL.map((roleItem) => {
                    userAuthorityIds += roleItem.user_authority_ids + ',';
                });
                let status = ~userAuthorityIds.indexOf(config.ARTICLE_BLOG.dfNoReviewArticleBlogId)
                    ? constant_1.statusList.freeReview
                    : constant_1.statusList.pendingReview;
                if (oneUserArticleBlog) {
                    throw new Error('不能创建自己已有的专题');
                }
                const createArticleBlog = yield models.article_blog.create({
                    name: blog_name,
                    en_name: en_name || shortid.generate(),
                    icon: icon || config.DF_ICON,
                    description: description || '',
                    uid: user.uid,
                    enable: enable || false,
                    tag_ids: tag_ids || '',
                    status
                });
                yield userVirtual_1.default.setVirtual({
                    uid: user.uid,
                    associate: createArticleBlog.blog_id,
                    type: constant_1.modelName.article_blog,
                    action: constant_1.modelAction.create
                });
                resClientJson(res, {
                    state: 'success',
                    message: '文章个人专栏创建成功'
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
     * 更新用户专题
     * @param   {object} ctx 上下文对象
     */
    static updateUserArticleBlog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const resData = req.body;
            let { user = '' } = req;
            try {
                let oneUserArticleBlog = yield models.article_blog.findOne({
                    where: {
                        name: resData.blog_name,
                        blog_id: {
                            [Op.ne]: resData.blog_id
                        }
                    }
                });
                if (oneUserArticleBlog) {
                    throw new Error('标题已存在');
                }
                if (resData.en_name) {
                    let enNameArticleBlog = yield models.article_blog.findOne({
                        where: {
                            en_name: resData.en_name,
                            blog_id: {
                                [Op.ne]: resData.blog_id
                            }
                        }
                    });
                    if (enNameArticleBlog) {
                        throw new Error('英文标题已存在');
                    }
                    if (resData.en_name.length > 60) {
                        throw new Error('英文标题小于60个字符');
                    }
                }
                let oneArticleTag = yield models.article_tag.findOne({
                    where: {
                        tag_id: config.ARTICLE_TAG.dfOfficialExclusive
                    }
                });
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                if (~resData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
                    if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
                        throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能使用`);
                    }
                }
                if (oneUserArticleBlog) {
                    throw new Error('不能修改自己已有的专题');
                }
                let userRoleALL = yield models.user_role.findAll({
                    where: {
                        user_role_id: {
                            [Op.or]: user.user_role_ids.split(',')
                        },
                        user_role_type: 1 // 用户角色类型1是默认角色
                    }
                });
                let userAuthorityIds = '';
                userRoleALL.map((roleItem) => {
                    userAuthorityIds += roleItem.user_authority_ids + ',';
                });
                let status = ~userAuthorityIds.indexOf(config.ARTICLE_BLOG.dfNoReviewArticleBlogId)
                    ? constant_1.statusList.freeReview // 免审核
                    : constant_1.statusList.pendingReview; // 待审核
                yield models.article_blog.update({
                    name: resData.blog_name,
                    en_name: resData.en_name || shortid.generate(),
                    icon: resData.icon || config.DF_ICON,
                    description: resData.description || '',
                    enable: resData.enable || false,
                    tag_ids: resData.tag_ids || '',
                    status
                }, {
                    where: {
                        blog_id: resData.blog_id,
                        uid: user.uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '更新成功'
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
     * 删除用户文章专题
     * @param   {object} ctx 上下文对象
     */
    static deleteUserArticleBlog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const resData = req.body;
            let { user = '' } = req;
            try {
                yield models.article_blog.destroy({
                    where: {
                        blog_id: resData.blog_id,
                        uid: user.uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '删除用户个人专栏成功'
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
    // 获取个人专栏详细信息信息
    static getArticleBlogView(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogId = req.query.blogId;
            try {
                let oneArticleBlog = yield models.article_blog.findOne({
                    where: {
                        blog_id: blogId // 查询条件
                    }
                });
                yield models.article_blog.update({ read_count: Number(oneArticleBlog.read_count) + 1 }, { where: { blog_id: blogId } } // 为空，获取全部，也可以自己添加条件
                );
                oneArticleBlog.setDataValue('create_dt', yield TimeDistance(oneArticleBlog.create_date));
                oneArticleBlog.setDataValue('update_dt', yield TimeDistance(oneArticleBlog.update_date));
                oneArticleBlog.setDataValue('articleCount', yield models.article.count({
                    where: { blog_ids: oneArticleBlog.blog_id }
                }));
                oneArticleBlog.setDataValue('likeCount', yield models.collect.count({
                    where: {
                        associate_id: oneArticleBlog.blog_id,
                        is_associate: true,
                        type: constant_1.modelName.article_blog
                    }
                }));
                oneArticleBlog.setDataValue('likeUserIds', yield models.collect.findAll({
                    where: {
                        associate_id: oneArticleBlog.blog_id,
                        is_associate: true,
                        type: constant_1.modelName.article_blog
                    }
                }));
                if (oneArticleBlog.tag_ids) {
                    oneArticleBlog.setDataValue('tag', yield models.article_tag.findAll({
                        where: {
                            tag_id: { [Op.or]: oneArticleBlog.tag_ids.split(',') }
                        }
                    }));
                }
                oneArticleBlog.setDataValue('user', yield models.user.findOne({
                    where: { uid: oneArticleBlog.uid },
                    attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                }));
                if (oneArticleBlog) {
                    yield resClientJson(res, {
                        state: 'success',
                        message: 'success',
                        data: {
                            articleBlog: oneArticleBlog
                        }
                    });
                }
                else {
                    yield resClientJson(res, {
                        state: 'success',
                        message: '文章个人专栏不存在',
                        data: {
                            articleBlog: {}
                        }
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
    // 获取个人专栏所含有的文章
    static getArticleBlogArticleList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 24;
            let sort = req.query.sort;
            let blogId = req.query.blogId;
            let whereParams = {
                blog_ids: blogId,
                is_public: true,
                status: {
                    [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                }
            };
            let orderParams = [];
            try {
                let { count, rows } = yield models.article.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: orderParams
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('update_dt', yield TimeDistance(rows[i].update_date));
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
                    message: 'success',
                    data: {
                        page,
                        count,
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
    // 获取用户like的专栏列表
    static getLikeArticleBlogList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 24;
            let uid = req.query.uid || '';
            let whereParams = {
                status: {
                    [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview]
                }
            };
            try {
                let { count, rows } = yield models.collect.findAndCountAll({
                    where: { is_associate: true, uid, type: constant_1.modelName.article_blog },
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                    // order: orderParams
                });
                for (let i in rows) {
                    const oneArticleBlog = yield models.article_blog.findOne({
                        where: Object.assign({ blog_id: rows[i].associate_id }, whereParams)
                    });
                    if (oneArticleBlog) {
                        oneArticleBlog.setDataValue('create_dt', yield TimeDistance(oneArticleBlog.create_date));
                        oneArticleBlog.setDataValue('update_dt', yield TimeDistance(oneArticleBlog.update_date));
                        rows[i].setDataValue('articleBlog', oneArticleBlog);
                    }
                    rows[i].setDataValue('user', yield models.user.findOne({
                        where: { uid: rows[i].uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    rows[i].setDataValue('articleCount', yield models.article.count({
                        where: { blog_ids: rows[i].associate_id }
                    }));
                    rows[i].setDataValue('likeCount', yield models.collect.count({
                        where: {
                            associate_id: rows[i].associate_id,
                            is_associate: true,
                            type: constant_1.modelName.article_blog
                        }
                    }));
                    rows[i].setDataValue('likeUserIds', yield models.collect.findAll({
                        where: {
                            associate_id: rows[i].associate_id,
                            is_associate: true,
                            type: constant_1.modelName.article_blog
                        }
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: 'success',
                    data: {
                        page,
                        count,
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
exports.default = articleBlog;
