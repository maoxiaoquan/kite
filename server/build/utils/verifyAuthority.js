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
const sequelize_1 = __importDefault(require("sequelize"));
const { resAdminJson, resClientJson } = require('../utils/resData');
const models = require('../../../db/mysqldb/index');
const config = require('../../../config');
const Op = sequelize_1.default.Op;
const noLimit = ['/admin-index/statistics', '/admin-user/info'];
class VerifyAuthority {
    // 前台权限验证
    static ClientCheck(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user = {} } = req;
            const url = req.url;
            const { user_role_ids } = user;
            try {
                if (user_role_ids) {
                    // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
                    /* 判断当前登录用户是否有角色，否则无任何权限 */
                    let clientUrl = '';
                    if (~url.indexOf('?')) {
                        clientUrl = url.split('?')[0];
                    }
                    else {
                        clientUrl = url;
                    }
                    let oneUserAuthority = yield models.user_authority.findOne({
                        where: { authority_url: clientUrl || '' }
                    });
                    if (oneUserAuthority) {
                        let allUserRole = yield models.user_role.findAll({
                            where: {
                                user_role_id: {
                                    [Op.in]: user_role_ids.split(',')
                                },
                                user_authority_ids: {
                                    [Op.like]: `%${oneUserAuthority.authority_id}%`
                                },
                                user_role_type: 1 // 用户角色类型1是默认角色
                            }
                        });
                        if (allUserRole && allUserRole.length > 0) {
                            yield next();
                        }
                        else {
                            throw new Error('当前功能用户无权限或者当前用户已被网站管理员禁用此功能，请联系管理员开启!');
                        }
                    }
                    else {
                        // 排除没有设置的接口
                        yield next();
                    }
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '当前用户账号出现问题'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: `错误提示:${err.message}`
                });
            }
        });
    }
    // 后台权限验证
    static AdminCheck(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, userInfo = {} } = req;
            const { role_id } = userInfo;
            if (role_id && role_id !== config.SUPER_ROLE_ID) {
                // 排除超管，超管无视所有，拥有最高权限 role = 1000000 为超管
                /* 判断当前登录用户是否有角色，否则无任何权限 */
                let adminUrl = '';
                if (~url.indexOf('?')) {
                    adminUrl = url.split('?')[0];
                }
                else {
                    adminUrl = url;
                }
                try {
                    let oneAdminAuthority = yield models.admin_authority.findOne({
                        where: { authority_url: adminUrl || '' }
                    });
                    if (oneAdminAuthority) {
                        let oneAdminRole = yield models.admin_role.findOne({
                            where: {
                                role_id: role_id
                            }
                        });
                        if (~oneAdminRole.admin_authority_ids.indexOf(oneAdminAuthority.authority_id)) {
                            yield next();
                        }
                        else {
                            throw new Error('当前用户组无权限!');
                        }
                    }
                    else if (~noLimit.indexOf(adminUrl)) {
                        // 排除某些特定接口
                        yield next();
                    }
                    else {
                        throw new Error('当前用户无权限!');
                    }
                }
                catch (err) {
                    resAdminJson(res, {
                        state: 'error',
                        message: '当前用户组无权限!'
                    });
                }
            }
            else {
                if (role_id === config.SUPER_ROLE_ID) {
                    // 超管直接拥有所有权限，设置无否都是拥有最高权限，超管只有一个，某些接口会判断，否则会报错
                    yield next();
                }
                else {
                    resAdminJson(res, {
                        state: 'error',
                        message: '当前用户组无任何操作权限'
                    });
                }
            }
        });
    }
}
module.exports = VerifyAuthority;
