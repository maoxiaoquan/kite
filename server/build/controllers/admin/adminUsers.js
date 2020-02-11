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
const { resSignJson, resAdminJson } = require('../../utils/resData');
const tokens = require('../../utils/tokens');
const { checkUserName, checkPwd, checkEmail } = require('../../utils/validators');
const { tools: { encrypt } } = require('../../utils/index');
const config = require('../../../../config');
const models = require('../../../../db/mysqldb/index');
const moment_1 = __importDefault(require("moment"));
const { createAdminSystemLog } = require('./adminSystemLog');
const Op = require('sequelize').Op;
const lowdb = require('../../../../db/lowdb/index');
class AdminUsers {
    /**
     * 登录操作
     * @param  {object} ctx 上下文对象
     */
    static adminSignIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let { account, password } = req.body;
            try {
                const oneAdminUser = yield models.admin_user.findOne({
                    where: { account }
                });
                if (!account) {
                    throw new Error('请输入账户!');
                }
                if (!checkUserName(account)) {
                    throw new Error('5-22个英文字符!');
                }
                if (!password) {
                    throw new Error('请输入密码!');
                }
                if (!oneAdminUser) {
                    throw new Error('用户不存在!');
                }
                if (!(encrypt(password, config.ENCRYPT_KEY) === oneAdminUser.password)) {
                    throw new Error('密码错误!');
                }
                if (!oneAdminUser.enable) {
                    throw new Error('您已被限制登录!');
                }
                let datas = {
                    uid: oneAdminUser.uid,
                    account,
                    role_id: oneAdminUser ? oneAdminUser.admin_role_ids : ''
                };
                let token = tokens.AdminSetToken(60 * 60 * 24 * 7, datas);
                resSignJson(res, {
                    state: 'success',
                    message: '登录成功',
                    token
                });
            }
            catch (err) {
                resSignJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                }, false);
                return false;
            }
        });
    }
    /**
     * 注册操作
     * @param   {object} ctx 上下文对象
     */
    static createAdminUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                if (!reqData.account) {
                    throw new Error('请输入账户!');
                }
                if (!reqData.nickname) {
                    throw new Error('请输入昵称!');
                }
                if (!checkUserName(reqData.account)) {
                    throw new Error('账户须5-22个英文字符!');
                }
                if (!reqData.password) {
                    throw new Error('请输入密码!');
                }
                if (!checkPwd(reqData.password)) {
                    throw new Error('密码格式输入有误!');
                }
                if (!checkEmail(reqData.email)) {
                    throw new Error('邮箱格式输入有误!');
                }
                let oneAdminUser = yield models.admin_user.findOne({
                    where: { account: reqData.account }
                });
                if (oneAdminUser) {
                    throw new Error('账户已存在!');
                }
                yield models.admin_user.create({
                    account: reqData.account,
                    avatar: config.default_avatar,
                    nickname: reqData.nickname,
                    password: encrypt(reqData.password, config.ENCRYPT_KEY),
                    email: reqData.email,
                    phone: reqData.phone,
                    reg_time: moment_1.default()
                        .utc()
                        .utcOffset(+8)
                        .format('X'),
                    reg_ip: req.ip,
                    enable: reqData.enable || false
                });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '注册成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 更新管理员用户
     * @param   {object} ctx 上下文对象
     */
    static editAdminUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.admin_user.update({
                    account: reqData.account,
                    nickname: reqData.nickname,
                    password: encrypt(reqData.password, config.ENCRYPT_KEY),
                    email: reqData.email,
                    phone: reqData.phone,
                    enable: reqData.enable || false
                }, {
                    where: {
                        uid: reqData.uid // 查询条件
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
                return false;
            }
        });
    }
    /**
     * 获取用户列表操作
     * @param   {object} ctx 上下文对象
     */
    static getAdminUserList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.admin_user.findAndCountAll({
                    attributes: [
                        'uid',
                        'account',
                        'nickname',
                        'email',
                        'phone',
                        'last_sign_time',
                        'reg_ip',
                        'enable',
                        'admin_role_ids'
                    ],
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize) // 每页限制返回的数据条数
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        admin_user_list: rows
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message
                });
                return false;
            }
        });
    }
    /**
     * 获取后台用户信息
     * @param   {object} ctx 上下文对象
     */
    static getAdminUserInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userInfo = {} } = req;
            try {
                const { role_id } = userInfo;
                let whereParmams = { authority_type: '1' };
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                let oneAdminRole = yield models.admin_role.findOne({
                    where: {
                        role_id
                    }
                });
                role_id !== config.SUPER_ROLE_ID &&
                    (whereParmams['authority_id'] = {
                        [Op.in]: oneAdminRole.admin_authority_ids.split(',')
                    });
                let AllAuthorityName = yield models.admin_authority.findAll({
                    where: whereParmams
                });
                let allAuthorityNameId = [];
                for (let i in AllAuthorityName) {
                    allAuthorityNameId.push(AllAuthorityName[i].authority_url);
                }
                let oneAdminUser = yield models.admin_user.findOne({
                    attributes: [
                        'uid',
                        'avatar',
                        'account',
                        'nickname',
                        'email',
                        'phone',
                        'last_sign_time',
                        'reg_ip',
                        'enable'
                    ],
                    where: {
                        uid: userInfo.uid
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        admin_user_info: oneAdminUser,
                        all_authority_name_id: allAuthorityNameId,
                        website
                    }
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: err.message
                });
                return false;
            }
        });
    }
    /**
     * 删除用户
     * @param   {object} ctx 上下文对象
     * 删除用户先判断管理员角色表中是否有关联，
     * 无关联则直接管理员删除，有关联则开启事务同时删除管理员角色关联表中关联
     * 管理员对角色是一对一的关系
     */
    static deleteAdminUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = req.body;
            /* 无关联 */
            try {
                yield models.admin_user.destroy({ where: { uid } });
                yield createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 3,
                    content: `成功删了了id为‘${uid}’的管理员`
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除管理员用户成功'
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: err.message
                });
                return false;
            }
        });
    }
}
exports.default = AdminUsers;
