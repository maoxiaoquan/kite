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
const { resAdminJson } = require('../../utils/resData');
class Picture {
    /**
     * -----------------------------------权限操作--------------------------------
     * 创建标签
     * @param   {object} ctx 上下文对象
     */
    static createPicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                let onePicture = yield models.picture.findOne({
                    where: { picture_title: reqData.picture_title }
                });
                if (onePicture) {
                    throw new Error('图片标题名已存在!');
                }
                if (!reqData.picture_url) {
                    throw new Error('请上传图片!');
                }
                yield models.picture.create({
                    picture_title: reqData.picture_title,
                    picture_url: reqData.picture_url
                        ? reqData.picture_url[0].response.data.filename
                        : '',
                    description: reqData.description,
                    enable: reqData.enable
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '图片创建成功'
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
     * 获取标签列表操作
     * @param   {object} ctx 上下文对象
     */
    static getPictureList(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 10 } = req.query;
            try {
                let { count, rows } = yield models.picture.findAndCountAll({
                    attributes: [
                        'picture_id',
                        'picture_title',
                        'picture_url',
                        'description',
                        'enable'
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
                        list: rows
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
     * 更新标签
     * @param   {object} ctx 上下文对象
     */
    static updatePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqData = req.body;
            try {
                yield models.picture.update({
                    picture_title: reqData.picture_title,
                    picture_url: reqData.picture_url[0].response
                        ? reqData.picture_url[0].response.data.filename
                        : reqData.picture_url,
                    description: reqData.description,
                    enable: reqData.enable
                }, {
                    where: {
                        picture_id: reqData.picture_id // 查询条件
                    }
                });
                resAdminJson(res, {
                    state: 'success',
                    message: '更新图片成功'
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
     * 删除标签
     */
    static deletePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { picture_id } = req.body;
            try {
                yield models.picture.destroy({ where: { picture_id } });
                resAdminJson(res, {
                    state: 'success',
                    message: '删除图片成功'
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
}
exports.default = Picture;
