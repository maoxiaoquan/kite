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
class Users {
    /**
     * 获取用户列表操作
     * @param   {object} ctx 上下文对象
     */
    static getUserList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.user.findAndCountAll({
                    attributes: [
                        'uid',
                        'nickname',
                        'last_sign_time',
                        'reg_ip',
                        'user_role_ids',
                        'ban_dt',
                        'enable'
                    ],
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                for (let i in rows) {
                    rows[i].setDataValue('ft_ban_dt', yield moment_1.default(rows[i].ban_dt).format('YYYY年MM月DD日 HH时mm分ss秒'));
                    rows[i].setDataValue('user_info', yield models.user_info.findOne({
                        where: {
                            uid: rows[i].uid
                        }
                    }));
                }
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        user_list: rows
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
     * 更新用户
     * @param   {object} ctx 上下文对象
     */
    static editUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, nickname, user_role_ids, enable } = req.body;
            try {
                yield models.user.update({
                    nickname: nickname,
                    user_role_ids: user_role_ids ? user_role_ids.join(',') : '',
                    enable: enable || false
                }, {
                    where: {
                        uid: uid // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新成功'
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
     * 删除用户
     * @param   {object} ctx 上下文对象
     * 删除用户先判断用户是否有文章，有则，同时删除文章
     * 无关联则直接删除用户，有关联则开启事务同时删除用户所含有的文章
     * 管理员对角色是一多一的关系
     */
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.body;
            try {
                let oneArticle = yield models.article.findOne({ where: { uid } });
                if (!oneArticle) {
                    /* 无关联 */
                    yield models.user.destroy({ where: { uid } });
                    resAdminJson(res, {
                        state: 'success',
                        message: '删除用户成功'
                    });
                }
                else {
                    /* 有关联 */
                    // 创建事务
                    yield models.sequelize.transaction((t) => {
                        // 在事务中执行操作
                        return models.user
                            .destroy({ where: { uid } }, { t })
                            .then(() => {
                            return models.article.destroy({ where: { uid } }, Object.assign({}, t));
                        });
                    });
                    resAdminJson(res, {
                        state: 'success',
                        message: '删除用户成功,同时删除用户所有文章'
                    });
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
    /**
     * 获取需要审核的头像
     * @param   {object} ctx 上下文对象
     */
    static getAvatarReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10, status = 1 } = req.query;
            try {
                let { count, rows } = yield models.user_info.findAndCountAll({
                    where: {
                        avatar_review_status: status
                    },
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                for (let i in rows) {
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
     * 审核用户头像
     * @param   {object} ctx 上下文对象
     */
    static set_avatar_review(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid, status } = req.body;
                let oneUserInfo = yield models.user_info.findOne({
                    where: {
                        uid: uid // 查询条件
                    }
                });
                if (status === '2') {
                    // 审核成功
                    yield models.user.update({
                        avatar: oneUserInfo.avatar_review
                    }, {
                        where: {
                            uid: uid // 查询条件
                        }
                    });
                    yield models.user_info.update({
                        avatar_review_status: status
                    }, {
                        where: {
                            uid: uid // 查询条件
                        }
                    });
                    resAdminJson(res, {
                        state: 'success',
                        message: '更新成功'
                    });
                }
                else if (status === '3' || status === '1') {
                    // 审核失败或者其他
                    yield models.user_info.update({
                        avatar_review_status: status
                    }, {
                        where: {
                            uid: uid // 查询条件
                        }
                    });
                    resAdminJson(res, {
                        state: 'success',
                        message: '更新成功'
                    });
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
    /**
     * 禁言用户
     * @param   {object} ctx 上下文对象
     */
    static banUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { uid, ban_dt } = req.body;
                let setUpdate = {};
                ban_dt && (setUpdate['ban_dt'] = new Date(ban_dt));
                // 审核成功
                yield models.user.update(Object.assign({}, setUpdate), {
                    where: {
                        uid: uid // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新成功'
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
}
exports.default = Users;
