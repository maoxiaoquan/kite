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
Object.defineProperty(exports, "__esModule", { value: true });
const models = require('../../../../db/mysqldb/index');
const { resClientJson } = require('../../utils/resData');
const { tools: { encrypt } } = require('../../utils/index');
const config = require('../../../../config');
const multer = require('nodemailer');
const upload = require('../../utils/upload'); // 上传工具类
const fs = require('fs');
const path = require('path');
const lowdb = require('../../../../db/lowdb/index');
const Op = require('sequelize').Op;
class Upload {
    /**
     * 用户头像上传修改
     * @param   {object} ctx 上下文对象
     */
    static uploadUserAvatar(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin || 'https://' + website.domain_name;
                    let { user = '' } = req;
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
                    let message = '';
                    if (~userAuthorityIds.indexOf(config.USER.dfUserAvatarNoReviewId)) {
                        message = '上传用户头像成功';
                        yield models.user.update({
                            avatar: `${origin}${destination}/${filename}`
                        }, {
                            where: {
                                uid: user.uid // 查询条件
                            }
                        });
                        yield models.user_info.update({
                            avatar_review_status: 2
                        }, {
                            where: {
                                uid: user.uid // 查询条件
                            }
                        });
                    }
                    else {
                        message = '上传用户头像成功，头像正在审核中';
                        yield models.user_info.update({
                            avatar_review: `${origin}${destination}/${filename}`,
                            avatar_review_status: 1
                        }, {
                            where: {
                                uid: user.uid // 查询条件
                            }
                        });
                    }
                    resClientJson(res, {
                        state: 'success',
                        message: message
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '上传用户头像失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
    /**
     * 文章图片上传
     * @param   {object} ctx 上下文对象
     */
    static uploadArticlePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const website = lowdb
                    .read()
                    .get('website')
                    .value();
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin || 'https://' + website.domain_name;
                    resClientJson(res, {
                        state: 'success',
                        message: '文章图片上传成功',
                        data: {
                            img: `${origin}${destination}/${filename}`
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '文章图片上传成功失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
    /**
     * 小书图片上传
     * @param   {object} ctx 上下文对象
     */
    static uploadBooksPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin;
                    resClientJson(res, {
                        state: 'success',
                        message: '小书图片上传成功',
                        data: {
                            img: `${origin}${destination}/${filename}`
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '小书图片上传成功失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
    /**
     * 小书章节图片上传
     * @param   {object} ctx 上下文对象
     */
    static uploadBookPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin;
                    resClientJson(res, {
                        state: 'success',
                        message: '小书图片上传成功',
                        data: {
                            img: `${origin}${destination}/${filename}`
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '小书图片上传成功失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
    /**
     * 动态图片上传
     * @param   {object} ctx 上下文对象
     */
    static uploadDynamicPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin;
                    resClientJson(res, {
                        state: 'success',
                        message: '动态图片上传成功',
                        data: {
                            img: `${origin}${destination}/${filename}`
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '动态图片上传成功失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
    // 个人专栏图片上传
    static uploadArticleBlogPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    let destination = req.file.destination.split('static')[1];
                    let filename = req.file.filename;
                    let origin = req.headers.origin;
                    resClientJson(res, {
                        state: 'success',
                        message: '个人专栏图片上传成功',
                        data: {
                            img: `${origin}${destination}/${filename}`
                        }
                    });
                }
                else {
                    resClientJson(res, {
                        state: 'error',
                        message: '个人专栏图片上传成功失败，文件格式有误'
                    });
                }
            }
            catch (err) {
                resClientJson(res, {
                    state: 'error',
                    message: '上传图片大于1m'
                });
                return false;
            }
        });
    }
}
exports.default = Upload;
