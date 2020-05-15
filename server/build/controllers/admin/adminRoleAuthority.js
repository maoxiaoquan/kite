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
const { resAdminJson } = require('../../utils/resData');
const models = require('../../../../db/mysqldb/index');
const Op = require('sequelize').Op;
const adminSystemLog_1 = __importDefault(require("./adminSystemLog"));
class adminRoleAuthority {
    /**
     * -----------------------------------角色操作--------------------------------
     * 创建角色
     * @param   {object} ctx 上下文对象
     */
    static createAdminRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role_name, role_description } = req.body;
            try {
                if (!role_name) {
                    throw new Error('请输入角色名!');
                }
                if (!role_description) {
                    throw new Error('请输入角色介绍!');
                }
                let oneAdminRole = yield models.admin_role.findOne({
                    where: { role_name },
                });
                if (oneAdminRole) {
                    throw new Error('角色已存在!');
                }
                yield models.admin_role.create({
                    role_name,
                    role_description,
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功创建了‘${role_name}’角色`,
                });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '角色创建成功',
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
    /**
     * 修改角色
     * @param   {object} ctx 上下文对象
     */
    static editAdminRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let oneAdminRole = yield models.admin_role.findOne({
                    where: {
                        role_name: reqData.role_name,
                        role_id: {
                            [Op.ne]: reqData.role_id,
                        },
                    },
                });
                if (oneAdminRole) {
                    throw new Error('角色名字已存在，请重新输入');
                }
                yield models.admin_role.update({
                    role_name: reqData.role_name,
                    role_description: reqData.role_description,
                }, {
                    where: {
                        role_id: reqData.role_id,
                    },
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功更新了id为‘${reqData.role_id}’的角色为‘${reqData.role_name}’`,
                });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '修改角色成功',
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
    /**
     * 删除角色
     * @param   {object} ctx 上下文对象
     */
    static deleteAdminRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role_id } = req.body;
            /* 角色与用户权限无关联的时候 */
            try {
                yield models.admin_role.destroy({ where: { role_id } });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '删除角色成功',
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
    /**
     * 获取角色列表
     * @param   {object} ctx 上下文对象
     */
    static getAdminRoleList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.admin_role.findAndCountAll({
                    attributes: [
                        'role_id',
                        'role_name',
                        'role_description',
                        'admin_authority_ids',
                    ],
                    where: '',
                    offset: (page - 1) * Number(pageSize),
                    limit: Number(pageSize),
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: {
                        count: count,
                        list: rows,
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
    /**
     * 获取全部角色
     * @param   {object} ctx 上下文对象
     */
    static getAdminRoleAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminRoleAll = yield models.admin_role.findAll();
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: adminRoleAll,
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
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建权限
     * @param   {object} ctx 上下文对象
     */
    static createAdminAuthority(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let oneAdminAuthorityName = yield models.admin_authority.findOne({
                    where: { authority_name: reqData.authority_name },
                });
                if (oneAdminAuthorityName) {
                    throw new Error('权限名已存在!');
                }
                let oneAdminAuthorityUrl = yield models.admin_authority.findOne({
                    where: { authority_url: reqData.authority_url },
                });
                if (oneAdminAuthorityUrl) {
                    throw new Error('权限路径已存在!');
                }
                yield models.admin_authority.create(Object.assign({}, reqData));
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功创建了‘${reqData.authority_name}’权限`,
                });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '权限创建成功',
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
    /**
     * 获取权限列表
     * @param   {object} ctx 上下文对象
     */
    static getAdminAuthorityList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let adminAuthorityAll = yield models.admin_authority.findAll();
                resAdminJson(res, {
                    state: 'success',
                    message: '返回成功',
                    data: adminAuthorityAll,
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
    /**
     * 修改权限
     * @param   {object} ctx 上下文对象
     */
    static updateAdminAuthority(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.admin_authority.update({
                    authority_name: reqData.authority_name,
                    authority_type: reqData.authority_type,
                    authority_url: reqData.authority_url,
                    authority_sort: reqData.authority_sort,
                    authority_description: reqData.authority_description,
                    enable: reqData.enable,
                }, {
                    where: {
                        authority_id: reqData.authority_id,
                    },
                });
                yield adminSystemLog_1.default.createAdminSystemLog({
                    // 写入日志
                    uid: req.userInfo.uid,
                    type: 1,
                    content: `成功更新了id为‘${reqData.authority_id}’的权限为‘${reqData.authority_name}’`,
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新权限成功',
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
    /**
     * 删除权限列表
     * @param   {object} ctx 上下文对象
     */
    static deleteAdminAuthority(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authority_id_arr } = req.body;
            try {
                yield models.admin_authority.destroy({
                    where: { authority_id: { [Op.in]: authority_id_arr } },
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除权限树成功',
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
    /**
     * 创建用户角色关联
     * @param   {object} ctx 上下文对象
     */
    static createAdminUserRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.admin_user.update({
                    admin_role_ids: reqData.role_id,
                }, {
                    where: {
                        uid: reqData.uid,
                    },
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新用户角色成功',
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
    /**
     * 设置角色权限关联
     * @param   {object} ctx 上下文对象
     */
    static setAdminRoleAuthority(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.admin_role.update({ admin_authority_ids: reqData.roleAuthorityListAll.join(',') }, {
                    where: { role_id: reqData.role_id },
                });
                yield resAdminJson(res, {
                    state: 'success',
                    message: '修改成功',
                });
            }
            catch (err) {
                resAdminJson(res, {
                    state: 'error',
                    message: '错误信息：' + err.message,
                });
            }
        });
    }
}
exports.default = adminRoleAuthority;
