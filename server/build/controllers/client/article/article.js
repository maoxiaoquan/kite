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
const cheerio = require('cheerio');
const clientWhere = require('../../../utils/clientWhere');
const xss = require('xss');
const config = require('../../../../../config');
const lowdb = require('../../../../../db/lowdb/index');
const constant_1 = require("../../../utils/constant");
const { TimeNow, TimeDistance } = require('../../../utils/time');
const userVirtual_1 = __importDefault(require("../../../common/userVirtual"));
const attention_1 = __importDefault(require("../../../common/attention"));
const useExperience_1 = __importDefault(require("../../../common/useExperience"));
function getNoMarkupStr(markupStr) {
    /* markupStr 源码</> */
    // console.log(markupStr);
    let noMarkupStr = markupStr;
    /* 得到可视文本(不含图片),将&nbsp;&lt;&gt;转为空字符串和<和>显示,同时去掉了换行,文本单行显示 */
    // console.log("1--S" + noMarkupStr + "E--");
    noMarkupStr = noMarkupStr.replace(/(\r\n|\n|\r)/gm, '');
    /* 去掉可视文本中的换行,(没有用,上一步已经自动处理) */
    // console.log("2--S" + noMarkupStr + "E--");
    noMarkupStr = noMarkupStr.replace(/^\s+/g, '');
    /* 替换开始位置一个或多个空格为一个空字符串 */
    // console.log("3--S" + noMarkupStr + "E--");
    noMarkupStr = noMarkupStr.replace(/\s+$/g, '');
    /* 替换结束位置一个或多个空格为一个空字符串 */
    // console.log("4--S" + noMarkupStr + "E--");
    noMarkupStr = noMarkupStr.replace(/\s+/g, ' ');
    /* 替换中间位置一个或多个空格为一个空格 */
    // console.log("5--S" + noMarkupStr + "E--");
    return noMarkupStr;
}
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == '') {
        return false;
    }
    else {
        return true;
    }
}
function getSubStr(string) {
    let str = '';
    let len = 0;
    for (var i = 0; i < string.length; i++) {
        if (string[i].match(/[^\x00-\xff]/gi) != null) {
            len += 2;
        }
        else {
            len += 1;
        }
        if (len > 240) {
            /* 240为要截取的长度 */
            str += '...';
            break;
        }
        str += string[i];
    }
    return str;
}
class Article {
    /**
     * 新建文章post提交
     * @param   {object} ctx 上下文对象
     */
    static createArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            let resultArticle = {}; // 新建成功后的文章
            try {
                if (!reqData.title) {
                    throw new Error('请输入文章标题');
                }
                if (reqData.title.length > 150) {
                    throw new Error('文章标题过长，请小于150个字符');
                }
                if (!reqData.content) {
                    throw new Error('请输入文章内容');
                }
                if (reqData.source.length === 0 || reqData.source === null) {
                    throw new Error('请选择文章来源类型');
                }
                if (!reqData.tag_ids) {
                    throw new Error('请选择文章标签');
                }
                let date = new Date();
                let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
                if (Number(reqData.is_attachment) === constant_1.isOpen.yes) {
                    if (Number(reqData.is_free) !== constant_1.isFree.free) {
                        if (!reqData.pay_type) {
                            throw new Error('请选择支付类型');
                        }
                        if (reqData.price < 0) {
                            throw new Error('请请输入大于等于0的定价！');
                        }
                        if (reqData.price > 100) {
                            throw new Error('当前定价不能超过100，后续等待管理员开放！');
                        }
                        if (!isDigit(reqData.price)) {
                            throw new Error('请输入整数数字类型！');
                        }
                    }
                    if (!reqData.attachment || reqData.attachment.length <= 0) {
                        throw new Error('附件内容不能为空');
                    }
                }
                if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
                    throw new Error(`当前用户因违规已被管理员禁用发布文章，时间到：${moment_1.default(user.ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`);
                }
                // 虚拟币判断是否可以进行继续的操作
                const isVirtual = yield userVirtual_1.default.isVirtual({
                    uid: user.uid,
                    type: constant_1.modelName.article,
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
                if (~reqData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
                    if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
                        throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能发布文章`);
                    }
                }
                const coverImg = reqData.origin_content.match(/!\[(.*?)\]\((.*?)\)/);
                let $ = cheerio.load(reqData.content);
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
                let status = ~userAuthorityIds.indexOf(config.USER_AUTHORITY.dfNoReviewArticleId)
                    ? constant_1.statusList.freeReview // 免审核
                    : constant_1.statusList.pendingReview; // 待审核
                let createArticle = yield models.article
                    .create({
                    uid: user.uid,
                    title: xss(reqData.title),
                    excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
                    content: xss(reqData.content) /* 主内容 */,
                    origin_content: reqData.origin_content /* 源内容 */,
                    source: reqData.source,
                    cover_img: coverImg ? coverImg[2] : '',
                    status,
                    is_public: Number(reqData.is_public),
                    type: reqData.type,
                    blog_ids: reqData.blog_ids,
                    tag_ids: reqData.tag_ids,
                    is_attachment: Number(reqData.is_attachment) /* 是否开启附件 */
                })
                    .then((result) => {
                    resultArticle = result.get({
                        plain: true
                    });
                    return result;
                });
                if (Number(reqData.is_attachment) === constant_1.isOpen.yes) {
                    // 附件功能
                    yield models.article_annex.create({
                        uid: user.uid,
                        aid: createArticle.aid,
                        is_free: Number(reqData.is_free) /* 源内容 */,
                        pay_type: reqData.pay_type /* 源内容 */,
                        price: Number(reqData.is_free) === constant_1.isFree.pay
                            ? parseInt(reqData.price)
                            : 0 /* 源内容 */,
                        title: xss(reqData.title),
                        attachment: xss(reqData.attachment) /*主内容*/,
                        origin_attachment: reqData.origin_attachment
                    });
                }
                yield userVirtual_1.default.setVirtual({
                    uid: user.uid,
                    associate: createArticle.aid,
                    type: constant_1.modelName.article,
                    action: constant_1.modelAction.create
                });
                yield attention_1.default.attentionMessage({
                    uid: user.uid,
                    type: constant_1.modelName.article,
                    action: constant_1.modelAction.create,
                    associate_id: resultArticle.aid
                });
                resClientJson(res, {
                    state: 'success',
                    message: '文章创建成功，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布'
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
     * 更新文章
     * @param   {object} ctx 上下文对象
     */
    static updateArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                let oneArticle = yield models.article.findOne({
                    where: {
                        aid: reqData.aid,
                        uid: user.uid // 查询条件
                    }
                });
                if (!oneArticle) {
                    throw new Error('非法操作');
                }
                if (!reqData.title) {
                    throw new Error('请输入文章标题');
                }
                if (reqData.title.length > 150) {
                    throw new Error('文章标题过长，请小于150个字符');
                }
                if (!reqData.content) {
                    throw new Error('请输入文章内容');
                }
                if (reqData.source.length === 0 || reqData.source === null) {
                    throw new Error('请选择文章来源类型');
                }
                if (!reqData.tag_ids) {
                    throw new Error('请选择文章标签');
                }
                if (Number(reqData.is_attachment) === constant_1.isOpen.yes) {
                    if (Number(reqData.is_free) !== constant_1.isFree.free) {
                        if (!reqData.pay_type) {
                            throw new Error('请选择支付类型');
                        }
                        if (reqData.price < 0) {
                            throw new Error('请请输入大于等于0的定价！');
                        }
                        if (reqData.price > 100) {
                            throw new Error('当前定价不能超过100，后续等待管理员开放！');
                        }
                        if (!isDigit(reqData.price)) {
                            throw new Error('请输入整数数字类型！');
                        }
                    }
                    if (!reqData.attachment || reqData.attachment.length <= 0) {
                        throw new Error('附件内容不能为空');
                    }
                }
                let date = new Date();
                let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
                if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
                    throw new Error(`当前用户因违规已被管理员禁用修改文章，时间到：${moment_1.default(user.ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`);
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
                if (~reqData.tag_ids.indexOf(config.ARTICLE_TAG.dfOfficialExclusive)) {
                    if (!~user.user_role_ids.indexOf(config.USER_ROLE.dfManagementTeam)) {
                        throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能更新文章`);
                    }
                }
                const coverImg = reqData.origin_content.match(/!\[(.*?)\]\((.*?)\)/);
                let $ = cheerio.load(reqData.content);
                let userRoleAll = yield models.user_role.findAll({
                    where: {
                        user_role_id: {
                            [Op.or]: user.user_role_ids.split(',')
                        },
                        user_role_type: 1 // 用户角色类型1是默认角色
                    }
                });
                let userAuthorityIds = '';
                userRoleAll.map((roleItem) => {
                    userAuthorityIds += roleItem.user_authority_ids + ',';
                });
                let status = ~userAuthorityIds.indexOf(config.USER_AUTHORITY.dfNoReviewArticleId)
                    ? constant_1.statusList.freeReview
                    : constant_1.statusList.pendingReview;
                yield models.article.update({
                    title: reqData.title,
                    excerpt: getSubStr(getNoMarkupStr($.text())) /* 摘记 */,
                    content: xss(reqData.content) /* 主内容 */,
                    origin_content: reqData.origin_content /* 源内容 */,
                    source: reqData.source,
                    cover_img: coverImg ? coverImg[2] : '',
                    status,
                    is_public: Number(reqData.is_public),
                    type: reqData.type,
                    blog_ids: reqData.blog_ids,
                    tag_ids: reqData.tag_ids,
                    is_attachment: Number(reqData.is_attachment) /* 是否开启附件 */,
                    update_date: moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss') /* 时间 */,
                    update_date_timestamp: moment_1.default(date.setHours(date.getHours())).format('X') /* 时间戳 */
                }, {
                    where: {
                        aid: reqData.aid,
                        uid: user.uid // 查询条件
                    }
                });
                let articleAnnex = yield models.article_annex.findOne({
                    where: { aid: reqData.aid, uid: user.uid }
                });
                if (Number(reqData.is_attachment) === constant_1.isOpen.yes) {
                    // 附件功能
                    if (articleAnnex) {
                        yield models.article_annex.update({
                            is_free: Number(reqData.is_free) /* 源内容 */,
                            pay_type: reqData.pay_type /* 源内容 */,
                            price: Number(reqData.is_free) === constant_1.isFree.pay
                                ? parseInt(reqData.price)
                                : 0 /* 源内容 */,
                            title: xss(reqData.title),
                            attachment: xss(reqData.attachment) /*主内容*/,
                            origin_attachment: reqData.origin_attachment,
                            update_date: moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss') /* 时间 */,
                            update_date_timestamp: moment_1.default(date.setHours(date.getHours())).format('X') /* 时间戳 */
                        }, {
                            where: {
                                aid: reqData.aid,
                                uid: user.uid // 查询条件
                            }
                        });
                    }
                    else {
                        // 附件功能
                        yield models.article_annex.create({
                            uid: user.uid,
                            aid: reqData.aid,
                            is_free: Number(reqData.is_free) /* 源内容 */,
                            pay_type: reqData.pay_type /* 源内容 */,
                            price: Number(reqData.is_free) === constant_1.isFree.pay
                                ? parseInt(reqData.price)
                                : 0 /* 源内容 */,
                            title: xss(reqData.title),
                            attachment: xss(reqData.attachment) /*主内容*/,
                            origin_attachment: reqData.origin_attachment
                        });
                    }
                }
                resClientJson(res, {
                    state: 'success',
                    message: '文章更新后需要重新审核，最晚会在4小时内由人工审核通过后发布，超过24点文章，将在次日8.30审核后发布'
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
     * 文章的标签页面
     * @param   {object} ctx 上下文对象
     */
    static getArticleTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let qyData = req.query;
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            try {
                let oneArticleTag = yield models.article_tag.findOne({
                    where: {
                        en_name: qyData.en_name
                    }
                });
                if (oneArticleTag) {
                    let { count, rows } = yield models.article.findAndCountAll({
                        where: {
                            tag_ids: {
                                [Op.like]: `%${oneArticleTag.tag_id}%`
                            },
                            is_public: true,
                            status: {
                                [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                            } // web 表示前台  公共文章限制文件
                        },
                        offset: (page - 1) * pageSize,
                        limit: pageSize,
                        order: [['create_timestamp', 'desc']]
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
                                    tag_id: {
                                        [Op.or]: rows[i].tag_ids.split(',')
                                    }
                                }
                            }));
                        }
                        rows[i].setDataValue('user', yield models.user.findOne({
                            where: { uid: rows[i].uid },
                            attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                        }));
                    }
                    let subscribeArticleTagCount = yield models.attention.count({
                        where: {
                            associate_id: oneArticleTag.tag_id,
                            is_associate: true,
                            type: constant_1.modelName.article_tag
                        }
                    });
                    /* 所有文章专题 */
                    let articleTagAll = yield models.article_tag.findAll({
                        attributes: ['tag_id', 'name', 'en_name']
                    });
                    yield resClientJson(res, {
                        state: 'success',
                        message: 'user',
                        data: {
                            page,
                            count,
                            pageSize,
                            en_name: qyData.en_name,
                            subscribe_count: subscribeArticleTagCount,
                            article_tag: oneArticleTag,
                            tag_all: articleTagAll,
                            article_list: rows
                        }
                    });
                }
                else {
                    throw new Error('当前文章标签不存在');
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
     * 获取热门文章标签
     * @param   {object} ctx 上下文对象
     */
    static getPopularArticleTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let articleTagAll = yield models.article_tag.findAll({
                    attributes: ['tag_id', 'name', 'en_name', 'icon', 'description'],
                    where: { enable: true },
                    limit: 12,
                    order: [
                        ['attention_count', 'DESC'] // ASC
                    ]
                });
                for (let i in articleTagAll) {
                    articleTagAll[i].setDataValue('subscribe_count', yield models.attention.count({
                        where: {
                            associate_id: articleTagAll[i].id || '',
                            is_associate: true,
                            type: constant_1.modelName.article_tag
                        }
                    }));
                    articleTagAll[i].setDataValue('article_count', yield models.article.count({
                        where: {
                            tag_ids: {
                                [Op.like]: `%${articleTagAll[i].tag_id}%`
                            }
                        }
                    }));
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取所有文章标签成功',
                    data: {
                        list: articleTagAll
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
     * 获取所有文章标签get
     * @param   {object} ctx 上下文对象
     */
    static getArticleTagAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let articleTagAll = yield models.article_tag.findAll({
                    attributes: ['tag_id', 'name', 'en_name', 'icon', 'description'],
                    where: { enable: true } // 为空，获取全部，也可以自己添加条件
                });
                for (let i in articleTagAll) {
                    articleTagAll[i].setDataValue('subscribe_count', yield models.attention.count({
                        where: {
                            associate_id: articleTagAll[i].id || '',
                            is_associate: true,
                            type: constant_1.modelName.article_tag
                        }
                    }));
                    articleTagAll[i].setDataValue('article_count', yield models.article.count({
                        where: {
                            tag_ids: {
                                [Op.like]: `%${articleTagAll[i].tag_id}%`
                            }
                        }
                    }));
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取所有文章标签成功',
                    data: {
                        list: articleTagAll
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
     * ajax 查询一篇文章
     * @param   {object} ctx 上下文对象
     */
    static getArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { aid } = req.query;
            const { user, islogin } = req;
            try {
                let oneArticle = yield models.article.findOne({
                    where: {
                        aid,
                        status: {
                            [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                        }
                    }
                });
                if (oneArticle) {
                    yield models.article.update({ read_count: Number(oneArticle.read_count) + 1 }, { where: { aid } } // 为空，获取全部，也可以自己添加条件
                    );
                    oneArticle.setDataValue('create_dt', yield TimeDistance(oneArticle.create_date));
                    let oneArticleBlog = yield models.article_blog.findOne({
                        where: { blog_id: oneArticle.blog_ids }
                    });
                    if (oneArticleBlog &&
                        ~[constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview].indexOf(oneArticleBlog.status)) {
                        oneArticle.setDataValue('article_blog', oneArticleBlog);
                    }
                    if (oneArticle.tag_ids) {
                        oneArticle.setDataValue('tag', yield models.article_tag.findAll({
                            where: {
                                tag_id: { [Op.or]: oneArticle.tag_ids.split(',') }
                            }
                        }));
                    }
                    oneArticle.setDataValue('user', yield models.user.findOne({
                        where: { uid: oneArticle.uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    if (islogin && user.uid !== oneArticle.uid) {
                        // 阅读他人的文章
                        yield useExperience_1.default.setExperience({
                            uid: user.uid,
                            ass_uid: oneArticle.uid,
                            associate: aid,
                            type: constant_1.modelName.article,
                            action: constant_1.modelAction.readOther
                        });
                    }
                    if (oneArticle) {
                        resClientJson(res, {
                            state: 'success',
                            message: '获取文章成功',
                            data: { article: oneArticle }
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '获取文章失败'
                        });
                    }
                }
                else {
                    throw new Error('获取文章失败');
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
     * ajax 获取用户自己的一篇文章
     * @param   {object} ctx 上下文对象
     */
    static getUserArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { aid } = req.query;
            let { user = '' } = req;
            try {
                let article = yield models.article.findOne({
                    where: { aid, uid: user.uid }
                });
                let articleAnnex = yield models.article_annex.findOne({
                    where: { aid: article.aid, uid: user.uid }
                });
                if (article) {
                    article.setDataValue('user', yield models.user.findOne({
                        where: { uid: article.uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    article.setDataValue('create_dt', yield TimeDistance(article.create_date));
                    if (article) {
                        resClientJson(res, {
                            state: 'success',
                            message: '获取当前用户文章成功',
                            data: { article, articleAnnex }
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '获取当前用户文章失败'
                        });
                    }
                }
                else {
                    throw new Error('获取当前用户文章失败');
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
     * 删除文章
     * @param   {object} ctx 上下文对象
     * 删除文章判断是否有文章
     * 无关联则直接删除文章，有关联则开启事务同时删除与文章的关联
     * 前台用户删除文章并不是真的删除，只是置为了删除态
     */
    static deleteArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { aid } = req.query;
            let { islogin = '', user = '' } = req;
            try {
                let oneArticle = yield models.article.findOne({
                    where: {
                        aid,
                        uid: user.uid // 查询条件
                    }
                });
                if (!oneArticle) {
                    throw new Error('文章不存在');
                }
                if (!islogin) {
                    throw new Error('请登录后尝试');
                }
                if (user.uid !== oneArticle.uid) {
                    throw new Error('非法操作已禁止');
                }
                yield models.article.update({
                    status: constant_1.statusList.deleted
                }, // '状态(0:草稿;1:审核中;2:审核通过;3:审核失败，4回收站，5已删除)'}, {
                {
                    where: {
                        aid,
                        uid: user.uid // 查询条件
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '删除文章成功'
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
     * 搜索
     * @param   {object} ctx 上下文对象
     */
    static searchArticle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            let search = req.query.search;
            try {
                let { count, rows } = yield models.article.findAndCountAll({
                    where: {
                        title: { [Op.like]: `%${search}%` },
                        is_public: true,
                        status: {
                            [Op.or]: [constant_1.statusList.reviewSuccess, constant_1.statusList.freeReview] // 审核成功、免审核
                        } // web 表示前台  公共文章限制文件
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
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
                /* 所有文章专题 */
                let allArticleTag = yield models.article_tag.findAll({
                    attributes: ['tag_id', 'name']
                });
                yield resClientJson(res, {
                    state: 'success',
                    message: 'search',
                    data: {
                        page,
                        count,
                        pageSize,
                        search,
                        tag_all: allArticleTag,
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
    /**
     * 获取文章专栏
     * @param   {object} ctx 上下文对象
     */
    static getArticleColumn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const en_name = req.query.en_name;
                let oneArticleColumn = yield models.article_column.findOne({
                    attributes: [
                        'column_id',
                        'name',
                        'en_name',
                        'icon',
                        'tag_ids',
                        'description'
                    ],
                    where: {
                        enable: true,
                        is_home: true,
                        en_name: en_name
                    }
                });
                if (oneArticleColumn && oneArticleColumn.tag_ids) {
                    oneArticleColumn.setDataValue('tag', yield models.article_tag.findAll({
                        where: {
                            tag_id: {
                                [Op.or]: oneArticleColumn.tag_ids.split(',')
                            }
                        }
                    }));
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取所有文章专栏成功',
                    data: {
                        view: oneArticleColumn
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
     * 获取文章专栏全部列表
     * @param   {object} ctx 上下文对象
     */
    static getArticleColumnAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let allArticleColumn = yield models.article_column.findAll({
                    attributes: [
                        'column_id',
                        'name',
                        'en_name',
                        'icon',
                        'tag_ids',
                        'description'
                    ],
                    where: {
                        enable: true,
                        is_home: true
                    },
                    order: [
                        ['sort', 'ASC'] // asc
                    ]
                });
                for (let i in allArticleColumn) {
                    if (allArticleColumn[i].tag_ids) {
                        allArticleColumn[i].setDataValue('tag', yield models.article_tag.findAll({
                            where: {
                                tag_id: {
                                    [Op.or]: allArticleColumn[i].tag_ids.split(',')
                                }
                            }
                        }));
                    }
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取所有文章专栏成功',
                    data: {
                        list: allArticleColumn
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
     * 获取文章专栏分页列表
     * @param   {object} ctx 上下文对象
     */
    static getArticleColumnList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 25;
            let whereParams = {
                enable: 1
            };
            try {
                let { count, rows } = yield models.article_column.findAndCountAll({
                    attributes: [
                        'column_id',
                        'name',
                        'en_name',
                        'icon',
                        'tag_ids',
                        'description'
                    ],
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize // 每页限制返回的数据条数
                });
                for (let i in rows) {
                    let tag_id = rows[i].tag_ids && rows[i].tag_ids.length === 1
                        ? rows[i].tag_ids
                        : { [Op.in]: rows[i].tag_ids.split(',') };
                    rows[i].setDataValue('tag', yield models.article_tag.findAll({
                        where: { tag_id }
                    }));
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: 'column',
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
    /**
     * ajax 获取文章附件
     * @param   {object} ctx 上下文对象
     */
    static getArticleAnnex(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { aid } = req.query;
            let { user = '', islogin } = req;
            try {
                let articleAnnex = yield models.article_annex.findOne({
                    where: { aid }
                });
                if (islogin && articleAnnex) {
                    let productInfo = yield models.order.findOne({
                        where: {
                            product_id: articleAnnex.id,
                            product_type: constant_1.modelName.article_annex,
                            uid: user.uid
                        }
                    });
                    if (articleAnnex.uid === user.uid) {
                        articleAnnex.setDataValue('isBuy', true);
                    }
                    else {
                        if (articleAnnex.is_free === constant_1.isFree.free) {
                            articleAnnex.setDataValue('isBuy', true);
                        }
                        else {
                            if (productInfo) {
                                articleAnnex.setDataValue('isBuy', true);
                            }
                            else {
                                articleAnnex.setDataValue('attachment', '');
                                articleAnnex.setDataValue('isBuy', false);
                            }
                        }
                    }
                }
                else if (articleAnnex) {
                    articleAnnex.setDataValue('attachment', '');
                    articleAnnex.setDataValue('isBuy', false);
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取当前用户文章附件信息成功',
                    data: { articleAnnex }
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
exports.default = Article;
