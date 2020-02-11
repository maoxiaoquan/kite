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
const { TimeNow, TimeDistance } = require('../../../utils/time');
const { statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes }, articleType, userMessageAction, modelAction, virtualType, payType, payTypeText, isFree, isFreeText, productType, trialRead, productTypeInfo, modelType } = require('../../../utils/constant');
const userVirtual_1 = __importDefault(require("../../../common/userVirtual"));
const attention_1 = __importDefault(require("../../../common/attention"));
function computedReadTime(s) {
    // 计算分钟
    // 算法：将秒数除以60，然后下舍入，既得到分钟数
    var slookTextNum = 5; // 一秒能看多少文字
    var h;
    h = Math.floor(s / (60 * slookTextNum));
    // 计算秒
    // 算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    // 将变量转换为字符串
    h += '';
    s += '';
    // 如果只有一位数，前面增加一个0
    h = h.length == 1 ? '0' + h : h;
    s = s.length == 1 ? '0' + s : s;
    return h + '分' + s + '秒';
}
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
class Books {
    /**
     * 新建小书post提交
     * @param   {object} ctx 上下文对象
     */
    static createBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                if (!reqData.title) {
                    throw new Error('请输入小书名字');
                }
                if (reqData.title.length > 150) {
                    throw new Error('小书标题过长，请小于150个字符');
                }
                if (!reqData.description) {
                    throw new Error('请输入小书简介');
                }
                if (!reqData.content) {
                    throw new Error('请输入小书详情');
                }
                if (!reqData.tag_ids) {
                    throw new Error('请选择小书标签');
                }
                if (!reqData.is_free) {
                    throw new Error('请选择是否免费还是付费');
                }
                if (Number(reqData.is_free) !== isFree.free) {
                    if (!reqData.pay_type) {
                        throw new Error('请选择支付类型');
                    }
                    if (reqData.price < 0) {
                        throw new Error('请请输入大于等于0的定价！');
                    }
                    if (reqData.price > 200) {
                        throw new Error('小书当前定价不能超过200，后续等待管理员开放！');
                    }
                    if (!isDigit(reqData.price)) {
                        throw new Error('请输入整数数字类型！');
                    }
                }
                let date = new Date();
                let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
                if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
                    throw new Error(`当前用户因违规已被管理员禁用发布系统，时间到：${moment_1.default(user.ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`);
                }
                // 虚拟币判断是否可以进行继续的操作
                const isVirtual = yield userVirtual_1.default.isVirtual({
                    uid: user.uid,
                    type: virtualType.books,
                    action: modelAction.create
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
                        throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能发布小书`);
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
                let status = ~userAuthorityIds.indexOf(config.BOOKS.dfNoReviewBooksId)
                    ? freeReview // 免审核
                    : pendingReview; // 待审核
                const createBooks = yield models.books.create({
                    uid: user.uid,
                    title: xss(reqData.title),
                    description: xss(reqData.description),
                    content: xss(reqData.content) /* 主内容 */,
                    cover_img: reqData.cover_img || config.DF_ICON /* 封面  */,
                    origin_content: reqData.origin_content /* 源内容 */,
                    status,
                    is_public: Number(reqData.is_public),
                    tag_ids: reqData.tag_ids,
                    is_free: reqData.is_free,
                    pay_type: reqData.pay_type,
                    price: parseInt(reqData.price) // 价格
                });
                yield userVirtual_1.default.setVirtual({
                    uid: user.uid,
                    associate: JSON.stringify({
                        books_id: createBooks.books_id
                    }),
                    type: virtualType.books,
                    action: modelAction.create
                });
                yield attention_1.default.attentionMessage({
                    uid: user.uid,
                    type: modelType.books,
                    action: modelAction.create,
                    associate_id: createBooks.books_id
                });
                resClientJson(res, {
                    state: 'success',
                    message: '创建成功'
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
     * ajax 查询一篇用户自己的小书
     * @param   {object} ctx 上下文对象
     */
    static getUserBooksInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { books_id } = req.query;
            let { user = '' } = req;
            try {
                let books = yield models.books.findOne({
                    where: {
                        uid: user.uid,
                        books_id
                    }
                });
                if (books) {
                    if (books) {
                        resClientJson(res, {
                            state: 'success',
                            message: '获取小书成功',
                            data: { books }
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '获取小书失败'
                        });
                    }
                }
                else {
                    throw new Error('获取小书失败');
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
     * 更新小书
     * @param   {object} ctx 上下文对象
     */
    static updateBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                if (!reqData.title) {
                    throw new Error('请输入小书名字');
                }
                if (reqData.title.length > 150) {
                    throw new Error('小书标题过长，请小于150个字符');
                }
                if (!reqData.description) {
                    throw new Error('请输入小书简介');
                }
                if (!reqData.content) {
                    throw new Error('请输入小书详情');
                }
                if (!reqData.tag_ids) {
                    throw new Error('请选择小书标签');
                }
                if (!reqData.is_free) {
                    throw new Error('请选择是否免费还是付费');
                }
                if (Number(reqData.is_free) !== isFree.free) {
                    if (!reqData.pay_type) {
                        throw new Error('请选择支付类型');
                    }
                    if (reqData.price < 0) {
                        throw new Error('请输入大于等于0的定价！');
                    }
                    if (reqData.price > 200) {
                        throw new Error('小书当前定价不能超过200，后续等待管理员开放！');
                    }
                    if (!isDigit(reqData.price)) {
                        throw new Error('请输入整数数字类型！');
                    }
                }
                let date = new Date();
                let currDate = moment_1.default(date.setHours(date.getHours())).format('YYYY-MM-DD HH:mm:ss');
                if (new Date(currDate).getTime() < new Date(user.ban_dt).getTime()) {
                    throw new Error(`当前用户因违规已被管理员禁用发布系统，时间到：${moment_1.default(user.ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒')},如有疑问请联系网站管理员`);
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
                        throw new Error(`${oneArticleTag.name}只有${website.website_name}管理团队才能发布小书`);
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
                let status = ~userAuthorityIds.indexOf(config.BOOKS.dfNoReviewBooksId)
                    ? freeReview // 免审核
                    : pendingReview; // 待审核
                yield models.books.update({
                    title: xss(reqData.title),
                    description: xss(reqData.description),
                    content: xss(reqData.content) /* 主内容 */,
                    cover_img: reqData.cover_img || config.DF_ICON /* 封面  */,
                    origin_content: reqData.origin_content /* 源内容 */,
                    status,
                    is_public: Number(reqData.is_public),
                    tag_ids: reqData.tag_ids,
                    is_free: reqData.is_free,
                    pay_type: reqData.pay_type,
                    price: parseInt(reqData.price) // 价格
                }, {
                    where: {
                        books_id: reqData.books_id,
                        uid: user.uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '修改小书成功'
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
     * 删除一本小书
     * @param   {object} ctx 上下文对象
     */
    static deleteBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const resData = req.body;
            let { user = '' } = req;
            try {
                yield models.books.update({
                    status: deletes
                }, // '状态(1:审核中;2:审核通过;3:审核失败，4回收站，5已删除)'}, {
                {
                    where: {
                        books_id: resData.books_id,
                        uid: user.uid
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '删除小书成功'
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
    // 首页的公开的小书列表
    static getBooksList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 24;
            let sort = req.query.sort;
            let tagId = req.query.tagId;
            let columnEnName = req.query.columnEnName;
            let tagIdArr = [];
            let whereParams = {
                is_public: true,
                status: {
                    [Op.or]: [reviewSuccess, freeReview]
                }
            };
            let orderParams = [];
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
                whereParams['tag_ids'] = {
                    [Op.notRegexp]: `${allArticleTagId.join('|')}`
                };
            }
            if (columnEnName && columnEnName !== 'all') {
                if (!tagId) {
                    let oneArticleColumn = yield models.article_column.findOne({
                        where: {
                            en_name: columnEnName
                        } // 为空，获取全部，也可以自己添加条件
                    });
                    tagIdArr = oneArticleColumn.tag_ids.split(',');
                }
                else {
                    tagIdArr = [tagId];
                }
            }
            !sort && (orderParams = [['create_date', 'DESC']]);
            sort === 'hot' && (orderParams = [['read_count', 'DESC']]);
            tagIdArr.length > 0 &&
                (whereParams['tag_ids'] = {
                    [Op.regexp]: `${tagIdArr.join('|')}`
                });
            sort === '7day' &&
                (whereParams['create_date'] = {
                    [Op.between]: [
                        new Date(TimeNow.showWeekFirstDay()),
                        new Date(TimeNow.showWeekLastDay())
                    ]
                });
            sort === '30day' &&
                (whereParams['create_date'] = {
                    [Op.between]: [
                        new Date(TimeNow.showMonthFirstDay()),
                        new Date(TimeNow.showMonthLastDay())
                    ]
                });
            try {
                let { count, rows } = yield models.books.findAndCountAll({
                    where: whereParams,
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: orderParams
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield TimeDistance(rows[i].create_date));
                    rows[i].setDataValue('update_dt', yield TimeDistance(rows[i].update_dt));
                    rows[i].setDataValue('bookCount', yield models.book.count({
                        where: { books_id: rows[i].books_id }
                    }));
                    rows[i].setDataValue('collectUserIds', yield models.collect.findAll({
                        where: {
                            associate_id: rows[i].books_id,
                            is_associate: true,
                            type: modelType.books
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
    /**
     * ajax 查询一篇小书信息
     * @param   {object} ctx 上下文对象
     */
    static getBooksInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { books_id, type } = req.query;
            let { user = '', islogin } = req;
            try {
                let books = yield models.books.findOne({
                    where: {
                        books_id
                    }
                });
                if (books) {
                    if (type === 'look') {
                        yield models.books.update({ read_count: Number(books.read_count) + 1 }, { where: { books_id } } // 为空，获取全部，也可以自己添加条件
                        );
                    }
                    books.setDataValue('create_dt', yield TimeDistance(books.create_date));
                    books.setDataValue('collectUserIds', yield models.collect.findAll({
                        where: {
                            associate_id: books.books_id,
                            is_associate: true,
                            type: modelType.books
                        }
                    }));
                    books.setDataValue('bookCount', yield models.book.count({ where: { books_id } }));
                    books.setDataValue('trialReadCount', yield models.book.count({
                        where: { books_id, trial_read: trialRead.yes }
                    }));
                    books.setDataValue('user', yield models.user.findOne({
                        where: { uid: books.uid },
                        attributes: ['uid', 'avatar', 'nickname', 'sex', 'introduction']
                    }));
                    if (islogin) {
                        // 获取商品信息
                        const productInfo = yield models.order.findOne({
                            where: {
                                product_id: books_id,
                                product_type: productType.books,
                                uid: user.uid
                            }
                        });
                        if (productInfo) {
                            // 存在商品信息，说明当前商品已被用户购买
                            books.setDataValue('isBuy', true);
                        }
                        else {
                            books.setDataValue('isBuy', false);
                        }
                    }
                    else {
                        books.setDataValue('isBuy', false);
                    }
                    if (books.status === deletes) {
                        books.setDataValue('content', '小书已被删除');
                    }
                    if (books) {
                        resClientJson(res, {
                            state: 'success',
                            message: '获取小书成功',
                            data: { books }
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '获取小书失败',
                            data: { books: {} }
                        });
                    }
                }
                else {
                    throw new Error('获取小书失败');
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
     * ajax 查询一篇小书所有的章节
     * @param   {object} ctx 上下文对象
     */
    static getBooksBookAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { books_id } = req.query;
            let { user = '', islogin } = req;
            try {
                let books = yield models.books.findOne({
                    where: {
                        books_id
                    }
                });
                if (books) {
                    let allBook = yield models.book.findAll({
                        where: {
                            books_id
                        },
                        attributes: [
                            'book_id',
                            'books_id',
                            'uid',
                            'title',
                            'excerpt',
                            'status',
                            'rejection_reason',
                            'sort',
                            'read_count',
                            'update_date',
                            'read_time',
                            'create_date',
                            'trial_read'
                        ]
                    });
                    console.log('islogin', islogin);
                    for (let i in allBook) {
                        if (islogin) {
                            console.log(11111111111111111111111);
                            // 获取商品信息
                            const productInfo = yield models.order.findOne({
                                where: {
                                    product_id: books_id,
                                    product_type: productType.books,
                                    uid: user.uid
                                }
                            });
                            if (productInfo) {
                                // 存在商品信息，说明当前商品已被用户购买
                                allBook[i].setDataValue('isBuy', true);
                            }
                            else {
                                allBook[i].setDataValue('isBuy', false);
                            }
                        }
                        else {
                            allBook[i].setDataValue('isBuy', false);
                        }
                        allBook[i].setDataValue('commentCount', yield models.book_comment.count({
                            where: { book_id: allBook[i].book_id }
                        }));
                        allBook[i].setDataValue('rTime', yield computedReadTime(allBook[i].read_time));
                    }
                    resClientJson(res, {
                        state: 'success',
                        message: '获取小书所有章节成功',
                        data: { list: allBook }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '获取小书章节失败，小书不存在'
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
    // 获取用户收藏的小书列表
    static getCollectBooksList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = req.query.pageSize || 24;
            let uid = req.query.uid || '';
            let whereParams = {
                is_public: true,
                status: {
                    [Op.or]: [reviewSuccess, freeReview]
                }
            };
            try {
                let { count, rows } = yield models.collect.findAndCountAll({
                    where: { is_associate: true, uid, type: modelType.books },
                    offset: (page - 1) * pageSize,
                    limit: pageSize // 每页限制返回的数据条数
                    // order: orderParams
                });
                for (let i in rows) {
                    const oneBooks = yield models.books.findOne({
                        where: Object.assign({ books_id: rows[i].associate_id }, whereParams)
                    });
                    rows[i].setDataValue('bookCount', yield models.book.count({
                        where: { books_id: rows[i].associate_id }
                    }));
                    if (oneBooks.tag_ids) {
                        oneBooks.setDataValue('tag', yield models.article_tag.findAll({
                            where: {
                                tag_id: { [Op.or]: oneBooks.tag_ids.split(',') }
                            }
                        }));
                    }
                    if (oneBooks) {
                        oneBooks.setDataValue('create_dt', yield TimeDistance(oneBooks.create_date));
                        oneBooks.setDataValue('update_dt', yield TimeDistance(oneBooks.update_date));
                        rows[i].setDataValue('books', oneBooks);
                    }
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
exports.default = Books;
