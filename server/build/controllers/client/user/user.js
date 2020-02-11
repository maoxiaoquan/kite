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
const { checkEmail, checkPhoneNum, checkUrl, checkPwd } = require('../../../utils/validators');
const moment_1 = __importDefault(require("moment"));
const { resClientJson } = require('../../../utils/resData');
const { sendVerifyCodeMail } = require('../../../utils/sendEmail');
const { random_number, tools } = require('../../../utils/index');
const config = require('../../../../../config');
const Op = require('sequelize').Op;
const tokens = require('../../../utils/tokens');
const lowdb = require('../../../../../db/lowdb/index');
const clientWhere = require('../../../utils/clientWhere');
const { statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes }, articleType, userMessageAction, userMessageActionText, modelAction, virtualType, virtualInfo, virtualPlusLess, modelType } = require('../../../utils/constant');
class User {
    static userSignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { no_login } = lowdb
                .read()
                .get('config')
                .value();
            let reqDate = req.body;
            try {
                if (!reqDate.email) {
                    throw new Error('请输入账户');
                }
                if (!reqDate.password) {
                    throw new Error('请输入密码');
                }
                if (no_login === 'no') {
                    throw new Error('登录功能关闭，请联系管理员开启');
                }
                if (reqDate.email) {
                    /* 邮箱登录 */
                    let oneUser = yield models.user.findOne({
                        where: {
                            email: reqDate.email
                        }
                    });
                    if (!oneUser) {
                        throw new Error('账户不存在');
                    }
                    if (!oneUser.enable) {
                        throw new Error('当前用户已被限制登录，请联系管理员修改');
                    }
                    if (oneUser) {
                        if (tools.encrypt(reqDate.password, config.ENCRYPT_KEY) ===
                            oneUser.dataValues.password) {
                            let user_info = {
                                uid: oneUser.uid
                            };
                            let token = tokens.ClientSetToken(60 * 60 * 24 * 7, user_info);
                            yield resClientJson(res, {
                                state: 'success',
                                message: '登录成功',
                                data: {
                                    token
                                }
                            });
                        }
                        else {
                            resClientJson(res, {
                                state: 'error',
                                message: '密码错误'
                            });
                        }
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '账户不存在'
                        });
                    }
                }
                else if (reqDate.phone) {
                    /* 手机号码登录 */
                    resClientJson(res, {
                        state: 'error',
                        message: '暂时未开放手机号码登录'
                    });
                }
                else {
                    /* 非手机号码非邮箱 */
                    resClientJson(res, {
                        state: 'error',
                        message: '请输入正确的手机号码或者邮箱'
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
    // 注册验证码发送
    static userSignUpCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            try {
                const { on_register } = lowdb
                    .read()
                    .get('config')
                    .value();
                if (reqData.email) {
                    /* 邮箱注册验证码 */
                    let oneUser = yield models.user.findOne({
                        where: {
                            email: reqData.email
                        }
                    });
                    if (on_register === 'no') {
                        throw new Error('注册功能关闭，请联系管理员开启');
                    }
                    if (reqData.email) {
                        if (!checkEmail(reqData.email)) {
                            throw new Error('请输入正确的邮箱地址');
                        }
                    }
                    if (reqData.phone) {
                        if (!checkPhoneNum(reqData.phone)) {
                            throw new Error('请输入正确的手机号码');
                        }
                    }
                    if (!oneUser) {
                        let random = random_number(true, 6, 6);
                        yield models.verify_code.create({
                            email: reqData.email,
                            verify_code: random,
                            type: 'register'
                        });
                        yield sendVerifyCodeMail(reqData.email, '注册验证码', random);
                        resClientJson(res, {
                            state: 'success',
                            message: '验证码已发送到邮箱'
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '邮箱已存在'
                        });
                    }
                }
                else if (reqData.phone) {
                    /* 手机号码注册 */
                    resClientJson(res, {
                        state: 'error',
                        message: '暂时未开放手机号码注册'
                    });
                }
                else {
                    /* 非手机号码非邮箱 */
                    resClientJson(res, {
                        state: 'error',
                        message: '请输入正确的手机号码或者邮箱'
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
     * 用户注册post
     * @param   {object} ctx 上下文对象
     */
    static userSignUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // post 数据
            let reqData = req.body;
            let date = new Date();
            try {
                const { on_register } = lowdb
                    .read()
                    .get('config')
                    .value();
                if (on_register === 'no') {
                    throw new Error('注册功能关闭，请联系管理员开启');
                }
                if (!reqData.nickname) {
                    throw new Error('昵称不存在');
                }
                if (reqData.nickname.length > 20) {
                    throw new Error('昵称过长');
                }
                if (reqData.email) {
                    if (!checkEmail(reqData.email)) {
                        throw new Error('请输入正确的邮箱地址');
                    }
                }
                if (reqData.phone) {
                    if (!checkPhoneNum(reqData.phone)) {
                        throw new Error('请输入正确的手机号码');
                    }
                }
                if (!reqData.password) {
                    throw new Error('密码不存在');
                }
                if (!checkPwd(reqData.password)) {
                    throw new Error('密码格式输入有误，请输入字母与数字的组合,长度为最小为6个字符!');
                }
                if (reqData.password !== reqData.double_password) {
                    throw new Error('两次输入密码不一致');
                }
                if (!reqData.code) {
                    throw new Error('验证码不存在');
                }
                if (reqData.email) {
                    /* 邮箱注册 */
                    let oneUserNickname = yield models.user.findOne({
                        where: {
                            nickname: reqData.nickname
                        }
                    });
                    if (oneUserNickname) {
                        resClientJson(res, {
                            state: 'error',
                            message: '用户昵称已存在，请重新输入'
                        });
                        return false;
                    }
                    let oneUserEmail = yield models.user.findOne({
                        where: {
                            email: reqData.email
                        }
                    });
                    if (!oneUserEmail) {
                        yield models.verify_code
                            .findOne({
                            where: {
                                email: reqData.email
                            },
                            limit: 1,
                            order: [['id', 'DESC']]
                        })
                            .then((data) => {
                            /* 注册验证码验证 */
                            if (data) {
                                let time_num = moment_1.default(date.setHours(date.getHours())).format('X');
                                if (reqData.code === data.verify_code) {
                                    if (Number(time_num) - Number(data.create_timestamp) >
                                        30 * 60) {
                                        throw new Error('验证码已过时，请再次发送');
                                    }
                                }
                                else {
                                    throw new Error('验证码错误');
                                }
                            }
                            else {
                                throw new Error('请发送验证码');
                            }
                        });
                        yield models.sequelize.transaction((t) => {
                            // 在事务中执行操作
                            return models.user
                                .create({
                                /* 注册写入数据库操作 */
                                avatar: config.default_avatar,
                                nickname: reqData.nickname,
                                password: tools.encrypt(reqData.password, config.ENCRYPT_KEY),
                                email: reqData.email,
                                user_role_ids: config.USER_ROLE.dfId,
                                sex: 0,
                                reg_ip: req.ip,
                                enable: true
                            }, { transaction: t })
                                .then((user) => {
                                return models.user_info.create({
                                    /* 注册写入数据库操作 */
                                    uid: user.uid,
                                    avatar_review_status: 2,
                                    shell_balance: virtualInfo[modelAction.registered][virtualType.system]
                                }, { transaction: t });
                            })
                                .then((user_info) => {
                                return models.virtual.create({
                                    // 用户虚拟币消息记录
                                    plus_less: virtualInfo[modelAction.registered].plusLess,
                                    balance: virtualInfo[modelAction.registered][virtualType.system],
                                    amount: virtualInfo[modelAction.registered][virtualType.system],
                                    income: virtualInfo[modelAction.registered][virtualType.system],
                                    expenses: 0,
                                    uid: user_info.uid,
                                    type: virtualType.system,
                                    action: modelAction.registered
                                });
                            });
                        });
                        resClientJson(res, {
                            state: 'success',
                            message: '注册成功，跳往登录页'
                        });
                    }
                    else {
                        throw new Error('邮箱已存在');
                    }
                }
                else if (reqData.phone) {
                    /* 手机号码注册 */
                    throw new Error('暂时未开放手机号码注册');
                }
                else {
                    /* 非手机号码非邮箱 */
                    throw new Error('请输入正确的手机号码或者邮箱');
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
     * 获取个人信息get 并且知道用户是否登录，不需要任何参数
     */
    static userPersonalInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { islogin = '', user = '' } = req;
            try {
                if (!islogin) {
                    yield resClientJson(res, {
                        state: 'success',
                        message: '获取成功',
                        data: {
                            islogin: false,
                            user: {}
                        }
                    });
                }
                let oneUser = yield models.user.findOne({
                    where: { uid: user.uid },
                    attributes: [
                        'uid',
                        'avatar',
                        'nickname',
                        'sex',
                        'introduction',
                        'user_role_ids'
                    ]
                });
                yield resClientJson(res, {
                    state: 'success',
                    message: '获取成功',
                    data: {
                        islogin,
                        user: oneUser
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
     * 获取用户信息get 不需要登录
     * @param   {object} ctx 上下文对象
     */
    static getUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.query.uid;
            try {
                if (!uid) {
                    throw new Error('uid为空');
                }
                let oneUser = yield models.user.findOne({
                    // 获取用户信息
                    where: { uid },
                    attributes: [
                        'uid',
                        'avatar',
                        'nickname',
                        'sex',
                        'introduction',
                        'user_role_ids'
                    ]
                });
                let oneUserInfo = yield models.user_info.findOne({
                    // 获取用户信息
                    where: { uid }
                });
                oneUser.setDataValue(
                // 我关注了哪些用户的信息
                'attentionUserIds', yield models.attention.findAll({
                    where: { uid: oneUser.uid, is_associate: true, type: modelType.user }
                }));
                oneUser.setDataValue(
                // 哪些用户关注了我
                'userAttentionIds', yield models.attention.findAll({
                    where: {
                        associate_id: oneUser.uid,
                        is_associate: true,
                        type: modelType.user
                    }
                }));
                let userAttentionCount = yield models.attention.count({
                    // 关注了多少人
                    where: {
                        uid,
                        is_associate: true,
                        type: modelType.user
                    }
                });
                let allLikeDynaicId = yield models.thumb
                    .findAll({
                    where: { uid, type: modelType.dynamic, is_associate: true }
                })
                    .then((res) => {
                    return res.map((item, key) => {
                        return item.associate_id;
                    });
                });
                let allRssDynamicTopicId = yield models.attention
                    .findAll({
                    where: { uid, type: modelType.dynamic_topic, is_associate: true }
                })
                    .then((res) => {
                    return res.map((item, key) => {
                        return item.associate_id;
                    });
                });
                let otherUserAttentionCount = yield models.attention.count({
                    // 多少人关注了
                    where: {
                        associate_id: uid,
                        is_associate: true,
                        type: modelType.user
                    }
                });
                let articleCount = yield models.article.count({
                    // 他有多少文章
                    where: Object.assign({ uid }, clientWhere.article.me)
                });
                let dynamicCount = yield models.dynamic.count({
                    // 他有多少文章
                    where: Object.assign({ uid }, clientWhere.dynamic.myQuery)
                });
                resClientJson(res, {
                    state: 'success',
                    message: '获取用户所有信息成功',
                    data: {
                        user: oneUser,
                        user_info: oneUserInfo,
                        otherUserAttentionCount: otherUserAttentionCount,
                        userAttentionCount: userAttentionCount,
                        userArticleCount: articleCount,
                        dynamicCount,
                        allLikeDynaicId,
                        allRssDynamicTopicId
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
     * 修改用户信息post
     * @param   {object} ctx 上下文对象
     */
    static updateUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            let oneUser = yield models.user.findOne({
                where: {
                    nickname: reqData.nickname,
                    uid: {
                        [Op.ne]: user.uid
                    }
                }
            });
            try {
                if (reqData.nickname && reqData.nickname.length > 20) {
                    throw new Error('昵称过长');
                }
                if (oneUser) {
                    throw new Error('用户昵称已存在，请重新输入');
                }
                if (reqData.introduction && reqData.introduction.length > 50) {
                    throw new Error('个人介绍过长');
                }
                if (reqData.profession && reqData.profession.length > 20) {
                    throw new Error('职位名输入过长');
                }
                if (reqData.company && reqData.company.length > 20) {
                    throw new Error('公司名字输入过长');
                }
                if (reqData.home_page && !checkUrl(reqData.home_page)) {
                    throw new Error('请输入正确的个人网址');
                }
                let updateUser = yield models.user.update({
                    sex: reqData.sex || '',
                    nickname: reqData.nickname || '',
                    introduction: reqData.introduction || ''
                }, {
                    where: {
                        uid: user.uid // 查询条件
                    }
                });
                let updateUserInfo = yield models.user_info.update({
                    profession: reqData.profession || '',
                    company: reqData.company || '',
                    home_page: reqData.home_page || '',
                    is_msg_push: reqData.is_msg_push
                }, {
                    where: {
                        uid: user.uid // 查询条件
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '修改用户信息成功',
                    data: {
                        user: updateUser,
                        user_info: updateUserInfo
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
     * 修改用户密码
     * @param   {object} ctx 上下文对象
     */
    static updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            let { user = '' } = req;
            try {
                let oneUser = yield models.user.findOne({
                    where: {
                        uid: user.uid
                    }
                });
                if (tools.encrypt(reqData.old_password, config.ENCRYPT_KEY) ===
                    oneUser.password) {
                    if (!reqData.old_password) {
                        throw new Error('请输入旧密码');
                    }
                    if (!reqData.new_password) {
                        throw new Error('请输入新密码');
                    }
                    if (!checkPwd(reqData.new_password)) {
                        throw new Error('密码格式输入有误!');
                    }
                    if (!reqData.repeat_new_password) {
                        throw new Error('请重复输入新密码');
                    }
                    if (reqData.repeat_new_password !== reqData.new_password) {
                        throw new Error('两次输入密码不相同');
                    }
                    yield models.user.update({
                        password: tools.encrypt(reqData.new_password, config.ENCRYPT_KEY)
                    }, {
                        where: {
                            uid: user.uid // 查询条件
                        }
                    });
                    resClientJson(res, {
                        state: 'success',
                        message: '修改用户密码成功'
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '旧密码错误，请重新输入'
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
     * 获取用户消息
     * @param   {object} ctx 上下文对象
     */
    static getUserMessageList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = req.query.page || 1;
            let pageSize = Number(req.query.pageSize) || 10;
            let { user = '' } = req;
            try {
                let allUserMessage = yield models.user_message.findAll({
                    // 获取所有未读消息id
                    where: {
                        is_read: false,
                        uid: user.uid
                    }
                });
                let { count, rows } = yield models.user_message.findAndCountAll({
                    where: {
                        uid: user.uid
                    },
                    offset: (page - 1) * pageSize,
                    limit: pageSize,
                    order: [['create_timestamp', 'desc']]
                });
                for (let i in rows) {
                    rows[i].setDataValue('create_dt', yield moment_1.default(rows[i].create_date).format('YYYY-MM-DD'));
                    rows[i].setDataValue('sender', yield models.user.findOne({
                        where: { uid: rows[i].sender_id },
                        attributes: ['uid', 'avatar', 'nickname']
                    }));
                    rows[i].setDataValue('actionText', userMessageActionText[rows[i].action]);
                    let content = rows[i].content && JSON.parse(rows[i].content);
                    // 以上是公共的数据
                    if (rows[i].action === userMessageAction.attention) {
                        // 用户关注 所需要的数据已获取,无需处理
                    }
                    else if (rows[i].action === userMessageAction.comment) {
                        // 评论
                        if (rows[i].type === modelType.article) {
                            // 文章评论
                            rows[i].setDataValue('article', yield models.article.findOne({
                                where: { aid: content.aid },
                                attributes: ['aid', 'title']
                            }));
                            rows[i].setDataValue('comment', yield models.article_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'aid']
                            }));
                        }
                        else if (rows[i].type === modelType.dynamic) {
                            // 片刻评论
                            rows[i].setDataValue('dynamic', yield models.dynamic.findOne({
                                where: { id: content.dynamic_id },
                                attributes: ['id', 'content']
                            }));
                            rows[i].setDataValue('comment', yield models.dynamic_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'dynamic_id']
                            }));
                        }
                        else if (rows[i].type === modelType.books) {
                            // 小书评论
                            rows[i].setDataValue('books', yield models.books.findOne({
                                where: { books_id: content.books_id },
                                attributes: ['books_id', 'title']
                            }));
                            rows[i].setDataValue('comment', yield models.books_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'books_id']
                            }));
                        }
                        else if (rows[i].type === modelType.book) {
                            // 小书章节评论
                            rows[i].setDataValue('book', yield models.book.findOne({
                                where: { book_id: content.book_id },
                                attributes: ['book_id', 'title', 'books_id']
                            }));
                            rows[i].setDataValue('comment', yield models.book_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
                            }));
                        }
                    }
                    else if (rows[i].action === userMessageAction.reply) {
                        // 评论回复
                        if (rows[i].type === modelType.article_comment) {
                            // 文章回复
                            rows[i].setDataValue('replyComment', yield models.article_comment.findOne({
                                where: { id: content.reply_id },
                                attributes: ['id', 'content', 'status', 'aid']
                            }));
                            rows[i].setDataValue('comment', yield models.article_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'aid']
                            }));
                        }
                        else if (rows[i].type === modelType.dynamic_comment) {
                            // 片刻回复
                            rows[i].setDataValue('replyComment', yield models.dynamic_comment.findOne({
                                where: { id: content.reply_id },
                                attributes: ['id', 'content', 'status', 'dynamic_id']
                            }));
                            rows[i].setDataValue('comment', yield models.dynamic_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'dynamic_id']
                            }));
                        }
                        else if (rows[i].type === modelType.books_comment) {
                            // 小书回复
                            rows[i].setDataValue('replyComment', yield models.books_comment.findOne({
                                where: { id: content.reply_id },
                                attributes: ['id', 'content', 'status', 'books_id']
                            }));
                            rows[i].setDataValue('comment', yield models.books_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'books_id']
                            }));
                        }
                        else if (rows[i].type === modelType.book_comment) {
                            // 小书章节回复
                            rows[i].setDataValue('replyComment', yield models.book_comment.findOne({
                                where: { id: content.reply_id },
                                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
                            }));
                            rows[i].setDataValue('comment', yield models.book_comment.findOne({
                                where: { id: content.comment_id },
                                attributes: ['id', 'content', 'status', 'book_id', 'books_id']
                            }));
                        }
                    }
                    else if (rows[i].action === userMessageAction.like) {
                        rows[i].setDataValue('article', yield models.article.findOne({
                            where: { aid: content.aid },
                            attributes: ['aid', 'title', 'uid']
                        }));
                    }
                    else if (rows[i].action === userMessageAction.thumb) {
                        if (rows[i].type === modelType.dynamic) {
                            rows[i].setDataValue('dynamic', yield models.dynamic.findOne({
                                where: { id: content.id },
                                attributes: ['id', 'content', 'uid']
                            }));
                        }
                        else if (rows[i].type === modelType.article) {
                            rows[i].setDataValue('article', yield models.article.findOne({
                                where: { aid: content.aid },
                                attributes: ['aid', 'title']
                            }));
                        }
                    }
                    else if (rows[i].action === userMessageAction.sell) {
                        if (rows[i].type === modelType.books) {
                            rows[i].setDataValue('books', yield models.books.findOne({
                                where: { books_id: content.books_id },
                                attributes: ['books_id', 'title']
                            }));
                        }
                    }
                }
                if (allUserMessage.length > 0) {
                    // 修改未读为已读
                    yield models.user_message.update({
                        is_read: true
                    }, {
                        where: {
                            is_read: false,
                            uid: user.uid
                        }
                    });
                }
                yield resClientJson(res, {
                    state: 'success',
                    message: '数据返回成功',
                    data: {
                        count,
                        list: rows,
                        page,
                        pageSize
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
     * 删除用户消息
     * @param   {object} ctx 上下文对象
     */
    static deleteUserMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.query;
            let { user = '' } = req;
            try {
                let oneUserMessage = yield models.user_message.findOne({
                    where: {
                        id: reqData.user_message_id,
                        uid: user.uid
                    }
                });
                if (oneUserMessage) {
                    yield models.user_message.destroy({
                        where: {
                            id: reqData.user_message_id,
                            uid: user.uid
                        }
                    });
                }
                else {
                    throw new Error('非法操作');
                }
                resClientJson(res, {
                    state: 'success',
                    message: '删除用户消息成功'
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
     * 重置密码code发送
     * @param   {object} ctx 上下文对象
     */
    static sendResetPasswordCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            try {
                if (reqData.type === 'email') {
                    /* 邮箱注册验证码 */
                    if (!reqData.email) {
                        throw new Error('邮箱不存在');
                    }
                    if (!checkEmail(reqData.email)) {
                        throw new Error('邮箱格式输入有误');
                    }
                    let email = yield models.user.findOne({
                        where: {
                            email: reqData.email
                        }
                    });
                    if (email) {
                        let random = random_number(true, 6, 6);
                        yield models.verify_code.create({
                            phone: '',
                            email: reqData.email,
                            type: 'reset_password',
                            verify_code: random,
                            expire_time: moment_1.default()
                                .utc()
                                .utcOffset(+8)
                                .format('X'),
                            create_date: moment_1.default()
                                .utc()
                                .utcOffset(+8)
                                .format() /* 时间 */
                        });
                        sendVerifyCodeMail(reqData.email, '重置密码验证码', random);
                        resClientJson(res, {
                            state: 'success',
                            message: '验证码已发送到邮箱'
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '邮箱不存在'
                        });
                    }
                }
                else if (reqData.type === 'phone') {
                    /* 手机号码 */
                    resClientJson(res, {
                        state: 'error',
                        message: '暂时未开放手机号码修改密码'
                    });
                }
                else {
                    /* 非手机号码非邮箱 */
                    resClientJson(res, {
                        state: 'error',
                        message: '请输入正确的手机号码或者邮箱'
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
     * 重置密码
     * @param   {object} ctx 上下文对象
     */
    static userResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let reqData = req.body;
            try {
                if (!reqData.email) {
                    throw new Error('邮箱不存在');
                }
                if (!checkEmail(reqData.email)) {
                    throw new Error('邮箱格式输入有误');
                }
                if (!reqData.code) {
                    throw new Error('验证码不存在');
                }
                if (!reqData.new_password) {
                    throw new Error('密码不存在');
                }
                if (!checkPwd(reqData.new_password)) {
                    throw new Error('密码格式输入有误!');
                }
                if (reqData.new_password !== reqData.repeat_new_password) {
                    throw new Error('两次输入密码不一致');
                }
                if (reqData.type === 'email') {
                    /* 邮箱注册 */
                    let email = yield models.user.findOne({
                        where: {
                            email: reqData.email
                        }
                    });
                    if (email) {
                        yield models.verify_code
                            .findOne({
                            where: {
                                email: reqData.email
                            },
                            limit: 1,
                            order: [['id', 'DESC']]
                        })
                            .then((data) => {
                            /* 重置密码验证码验证 */
                            if (data) {
                                let timeNum = moment_1.default()
                                    .utc()
                                    .utcOffset(+8)
                                    .format('X');
                                if (reqData.code === data.verify_code) {
                                    if (Number(timeNum) - Number(data.expire_time) > 30 * 60) {
                                        throw new Error('验证码已过时，请再次发送');
                                    }
                                }
                                else {
                                    throw new Error('验证码错误');
                                }
                            }
                            else {
                                throw new Error('请发送验证码');
                            }
                        });
                        yield models.user.update({
                            password: tools.encrypt(reqData.new_password, config.ENCRYPT_KEY)
                        }, {
                            where: {
                                email: reqData.email // 查询条件
                            }
                        });
                        resClientJson(res, {
                            state: 'success',
                            message: '修改用户密码成功'
                        });
                    }
                    else {
                        resClientJson(res, {
                            state: 'error',
                            message: '邮箱不存在'
                        });
                    }
                }
                else if (reqData.type === 'phone') {
                    // 手机号码重置密码
                    resClientJson(res, {
                        state: 'error',
                        message: '暂时未开放手机号码重置密码'
                    });
                }
                else {
                    /* 非手机号码非邮箱 */
                    resClientJson(res, {
                        state: 'error',
                        message: '请输入正确的手机号码或者邮箱'
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
     *  获取所有用户角色标签
     * @param   {object} ctx 上下文对象
     */
    static getUserRoleAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // get 页面
            try {
                let allUserRole = yield models.user_role.findAll({
                    where: {
                        enable: true,
                        is_show: true
                    }
                });
                resClientJson(res, {
                    state: 'success',
                    message: '获取成功',
                    data: {
                        user_role_all: allUserRole
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
     *  获取用户关联的一些信息
     * @param   {object} ctx 上下文对象
     */
    static getUserAssociateinfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // get 页面
            try {
                let articleThumdId = []; // 文章点赞id
                let dynamicThumdId = []; // 动态点赞id
                let userAttentionId = []; // 用户关注id
                let { user = '', islogin } = req;
                if (!islogin) {
                    resClientJson(res, {
                        state: 'success',
                        message: '获取成功',
                        data: {
                            articleThumdId,
                            dynamicThumdId
                        }
                    });
                    return false;
                }
                let allThumb = yield models.thumb.findAll({
                    where: {
                        uid: user.uid,
                        is_associate: true
                    }
                });
                let allAttention = yield models.attention.findAll({
                    where: {
                        uid: user.uid,
                        is_associate: true
                    }
                });
                for (let i in allThumb) {
                    if (allThumb[i].type === modelType.article) {
                        articleThumdId.push(allThumb[i].associate_id);
                    }
                    else if (allThumb[i].type === modelType.dynamic) {
                        dynamicThumdId.push(allThumb[i].associate_id);
                    }
                }
                for (let i in allAttention) {
                    if (allAttention[i].type === modelType.user) {
                        userAttentionId.push(allAttention[i].associate_id);
                    }
                }
                resClientJson(res, {
                    state: 'success',
                    message: '获取成功',
                    data: {
                        articleThumdId,
                        dynamicThumdId,
                        userAttentionId
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
exports.default = User;
